import json
import sys

# Import featureSHAP system
from feature_shap.core.feature_shap import FeatureShap
from feature_shap.models.openai_model import OpenAIModel
from feature_shap.splitters.tokenizer_splitter import TokenizerSplitter
from feature_shap.modifiers.remover_modifier import RemoverModifier


# --------------------------
# Inputs from VS Code
# --------------------------
code_snippet = sys.argv[1]
output_json = sys.argv[2]

# --------------------------
# Build FeatureSHAP pipeline
# --------------------------
# NOTE: This uses OpenAI model. You may need to set OPENAI_API_KEY
model = OpenAIModel(model_name="gpt-3.5-turbo")

splitter = TokenizerSplitter()
modifier = RemoverModifier()

fs = FeatureShap(
    model=model,
    splitter=splitter,
    modifier=modifier
)

# --------------------------
# Run attribution
# --------------------------
explanations = fs.explain(code_snippet)

# explanations = [ {"token": "...", "importance": float}, ... ]

global_scores = {}

for e in explanations:
    tok = e["token"]
    score = abs(e["importance"])
    global_scores[tok] = global_scores.get(tok, 0) + score

sorted_items = sorted(global_scores.items(), key=lambda x: -x[1])

out = {
    "feature_names": [x[0] for x in sorted_items],
    "mean_abs_shap": [x[1] for x in sorted_items]
}

with open(output_json, "w") as f:
    json.dump(out, f)
