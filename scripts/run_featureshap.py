import json
import os
import sys
from feature_shap.models.huggingface_model import HuggingFaceModel

from feature_shap.core.feature_shap import FeatureSHAP
from feature_shap.models.openai_model import OpenAIModel
from feature_shap.splitters.llm_splitter import LLMSplitter
from feature_shap.modifiers.remover_modifier import RemoverModifier
from feature_shap.comparators.metrics.bleu_comparator import BLEUComparator
from feature_shap.models.vllm_model import VLLMModel
from feature_shap.splitters.block_splitter import BlocksSplitter


code = sys.argv[1]
out_path = sys.argv[2]

api_key = "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"
if api_key is None:
    raise ValueError("OPEN_AI_KEY environment variable is not set.")

model = HuggingFaceModel(
    model_name_or_path="distilgpt2",
    device="cpu"
)
splitter = BlocksSplitter()
modifier = RemoverModifier(language="python")
comparator = BLEUComparator()

fs = FeatureSHAP(
    model=model,
    splitter=splitter,
    modifier=modifier,
    comparator=comparator,
    instruction="Summarize the following function:",
)

df = fs.analyze(code, sampling_ratio=1)

# Shapley values are stored in:
result = fs.shapley_values

# Save to JSON
with open(out_path, "w") as f:
    json.dump(result, f, indent=2)

print("OK")
