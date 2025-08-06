def translate_base64_content_to_text(base64_content: str, reverse: bool = False) -> str:
    """
    Translate base64 encoded content to text or encode text to base64.

    :param base64_content: Base64 encoded string or plain text.
    :param reverse: If True, encode text to base64. If False, decode base64 to text.
    :return: Decoded text or base64 encoded string.
    """
    import base64

    try:
        if reverse:
            encoded_bytes = base64.b64encode(base64_content.encode("utf-8"))
            return encoded_bytes.decode("utf-8")
        else:
            decoded_bytes = base64.b64decode(base64_content)
            return decoded_bytes.decode("utf-8")
    except Exception as e:
        raise ValueError(f"Failed to process base64 content: {e}")
