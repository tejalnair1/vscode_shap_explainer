from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn
import random

# -------------------------------
# Request schema
# -------------------------------

class ShapRequest(BaseModel):
    code: str
    sampling_ratio: float = 0.0   # ignored in mock


# -------------------------------
# Logical Python splitter
# -------------------------------

def logical_split(code: str):
    """
    Splits Python code into logical blocks instead of raw lines.
    Handles:
        - multiline function calls
        - argument lists
        - parentheses/braces/brackets
        - trailing commas
    """

    lines = code.split("\n")
    blocks = []
    current = []
    paren = 0  # count (, [, { vs ), ], }

    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue

        current.append(line)

        # count parentheses/brackets/braces
        paren += line.count("(") - line.count(")")
        paren += line.count("[") - line.count("]")
        paren += line.count("{") - line.count("}")

        # continue the block if parentheses aren't balanced yet
        if paren > 0:
            continue

        # continue if a trailing comma suggests continuation
        if stripped.endswith(","):
            continue

        # continue if ending with backslash \
        if stripped.endswith("\\"):
            continue

        # block is complete
        blocks.append("\n".join(current))
        current = []

    # leftover block
    if current:
        blocks.append("\n".join(current))

    return blocks


# -------------------------------
# FastAPI app
# -------------------------------

app = FastAPI()

@app.post("/compute_shap")
async def compute_shap(req: ShapRequest):
    """
    MOCK IMPLEMENTATION:
    Splits code into logical Python statements, assigns random SHAP scores.
    """

    blocks = logical_split(req.code)

    # Generate random raw values
    raw_vals = {i+1: random.random() for i in range(len(blocks))}

    # Sum-based normalization to 100%
    vals = list(raw_vals.values())
    total = sum(vals)
    if total == 0:
        norm_vals = [100 / len(vals)] * len(vals)   # equal distribution
    else:
        norm_vals = [(v / total) * 100 for v in vals]

    shap_list = []
    for idx, block in enumerate(blocks, start=1):
        value = raw_vals[idx]
        percent = norm_vals[idx - 1]

        shap_list.append({
            "id": idx,
            "text": block,
            "value": float(value),
            "percent": float(percent),
        })

    return {"shap_values": shap_list}



# -------------------------------
# Run server
# -------------------------------

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=5005)
