import xenaPython as xena

hub = "https://tcga.xenahubs.net"
dataset = "TCGA.BLCA.sampleMap/HiSeqV2"

# Samples
samples = xena.xenaAPI.dataset_samples (hub, dataset)
# Fields Are Genes
fields = xena.xenaAPI.dataset_fields (hub, dataset)