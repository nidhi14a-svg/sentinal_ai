import os
import json
import time
from typing import Any
import requests


class ClaudeClientError(Exception):
    pass


class ClaudeClient:
    """Simple configurable wrapper for a Claude-style API.

    This client expects the following environment variables (or constructor args):
    - `CLAUDE_API_KEY` : API key/token for the Claude endpoint
    - `CLAUDE_API_URL` : full HTTPs URL for the Claude API endpoint

    Note: do NOT commit your API key into the repository. Place it in a private
    `.env` file or your environment and load it at runtime.
    """

    def __init__(self, api_key: str | None = None, api_url: str | None = None, timeout: int = 30):
        self.api_key = api_key or os.getenv("CLAUDE_API_KEY")
        self.api_url = api_url or os.getenv("CLAUDE_API_URL")
        self.timeout = timeout

        if not self.api_key or not self.api_url:
            # Do not raise here to allow callers to decide fallback behaviour,
            # but mark the client as unusable.
            self._usable = False
        else:
            self._usable = True

    def is_usable(self) -> bool:
        return self._usable

    def send_analysis_prompt(self, prompt: str, max_retries: int = 1) -> dict[str, Any]:
        """Send a textual prompt to the Claude API and parse a JSON response.

        Retries once on parse failure or transient errors. Returns the parsed
        JSON object on success or raises ClaudeClientError.
        """
        if not self.is_usable():
            raise ClaudeClientError("Claude client not configured (missing API key or URL)")

        headers = {
            "x-api-key": self.api_key,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        }
        
        try:
            prompt_data = json.loads(prompt)
            system_prompt = prompt_data.get("instruction", "You are an AI security assistant.")
            user_content = json.dumps(prompt_data.get("payload", prompt_data), indent=2)
        except Exception:
            system_prompt = "You are an AI security assistant."
            user_content = prompt

        payload = {
            "model": "claude-3-haiku-20240307",
            "max_tokens": 2048,
            "system": system_prompt,
            "messages": [
                {"role": "user", "content": user_content}
            ]
        }

        attempts = 0
        last_exc: Exception | None = None
        while attempts <= max_retries:
            attempts += 1
            try:
                resp = requests.post(self.api_url, headers=headers, json=payload, timeout=self.timeout)
                resp.raise_for_status()

                text = resp.text.strip()
                # Attempt to extract JSON from the response text if wrapped in code fences
                json_text = self._extract_json(text)
                parsed = json.loads(json_text)
                return parsed

            except requests.RequestException as re:
                last_exc = re
                # On network/HTTP error, retry if attempts remain
                time.sleep(1)
                continue
            except (json.JSONDecodeError, ValueError) as je:
                last_exc = je
                # Parsing errors: retry once
                time.sleep(0.5)
                continue

        raise ClaudeClientError(f"Failed to get valid JSON response from Claude after {attempts} attempts: {last_exc}")

    def _extract_json(self, text: str) -> str:
        """Extract a JSON substring from text. If the whole text is JSON, return it.

        Heuristics: if text contains ```json or ``` then extract inner content. If
        text contains the first { and last }, return that slice. Otherwise return text.
        """
        # Remove any Markdown fences
        if "```json" in text:
            parts = text.split("```json")
            # take content after the first fence
            tail = parts[1] if len(parts) > 1 else parts[0]
            tail = tail.rsplit("```", 1)[0]
            return tail.strip()
        if "```" in text:
            parts = text.split("```")
            if len(parts) >= 3:
                return parts[1].strip()

        # Fallback: extract first {...} block
        start = text.find("{")
        end = text.rfind("}")
        if start != -1 and end != -1 and end > start:
            return text[start:end+1]

        # Last resort: return the entire text (may fail JSON parsing)
        return text
