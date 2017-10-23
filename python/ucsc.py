import xenaPython as xena

hub = "https://tcga.xenahubs.net"
dataset = "TCGA.BLCA.sampleMap/HiSeqV2"

# Samples
samples = xena.xenaAPI.dataset_samples (hub, dataset)
# Fields Are Genes
genes = xena.xenaAPI.dataset_fields (hub, dataset)

# Values
xena.xenaAPI.Genes_values (hub, dataset, samples, genes)