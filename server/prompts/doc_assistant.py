def build_assistant_prompt(question: str, context: str) -> list:
    """
    Builds a prompt for the document assistant based on the question and context.

    Args:
        question (str): The question to be answered.
        context (str): The documentation context to use for answering the question.

    Returns:
        list: A list of messages forming the prompt.
    """
    from langchain_core.messages import SystemMessage, HumanMessage

    system_prompt = SystemMessage(
        content="""
        You are a helpful and clear AI assistant for developers.
        Use the retrieved documentation to explain things in your own words.
        Always include examples or analogies to aid understanding.
        Avoid quoting the text directly unless needed.
        If you do not know the answer, say "I don't know" instead of making up information.
        """
    )

    user = HumanMessage(
        content=f"""Based on the following documentation context, answer the question thoroughly but clearly.
        Context:
        {context}
        Question:
        {question}
        """
    )
    return [ system_prompt,  user ]
