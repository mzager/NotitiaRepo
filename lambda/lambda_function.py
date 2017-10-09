#!/usr/bin/env python
"""AWS PYTHON LIB"""

import json

from Bio.Cluster import pca
from Bio.Cluster import kcluster
from Bio.Cluster import kmedoids
from Bio.Cluster import somcluster
from Bio.Cluster import clustercentroids
from Bio.Cluster import treecluster

from sklearn.manifold import MDS
from sklearn.manifold import TSNE
from sklearn.manifold import Isomap
from sklearn.manifold import LocallyLinearEmbedding
from sklearn.manifold import SpectralEmbedding

from sklearn.decomposition import PCA
from sklearn.decomposition import IncrementalPCA
from sklearn.decomposition import MiniBatchSparsePCA
from sklearn.decomposition import KernelPCA
from sklearn.decomposition import RandomizedPCA
from sklearn.decomposition import SparsePCA
from sklearn.decomposition import NMF
from sklearn.decomposition import FactorAnalysis
from sklearn.decomposition import LatentDirichletAllocation
from sklearn.decomposition import FastICA
from sklearn.decomposition import DictionaryLearning
from sklearn.decomposition import TruncatedSVD
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis

#with sklearn.config_context(assume_finite=True):
#import numpy as np
#from Bio.Cluster import clusterdistance
#from Bio import LogisticRegression

def httpWrapper(body):
    """ Wrap Response Body In HTTP """
    return {
        "isBase64Encoded": 'true',
        "statusCode": 200,
        "headers": { "Access-Control-Allow-Origin": "http://localhost:4200/" },
        "body": body
    }

def echo(event, context):
    """ Bio Centroids """
    return {'echo':'echo'}

def cluster_bio_pca(event, context):
    """ Bio Centroids | data:[[]] """
    columnmean, coordinates, components, eigenvalues = pca(event['body']['data'])
    return httpWrapper(json.dumps({
        'columnmean': columnmean.tolist(),
        'coordinates': coordinates.tolist(),
        'components': components.tolist(),
        'eigenvalues': eigenvalues.tolist()
    }))

def cluster_bio_tree(event, context):
    """ Bio Tree | data:[[]] """
    tree = treecluster(data=event['body']['data'])
    nodes = list(map(lambda node: {'l':node.left,'r':node.right,'d':node.distance}, tree))
    return httpWrapper(json.dumps(nodes))

def cluster_bio_centroids(event, context):
    """ Bio Centroids | data:[[]] """
    cdata, cmask = clustercentroids(event['body']['data'])
    return httpWrapper(json.dumps({
        'cdata': cdata.tolist(),
        'cmask': cmask.tolist()
    }))

def cluster_bio_som(event, context):
    """ Bio Som | data:[[]] """
    clusterid, celldata = somcluster(event['body']['data'])
    return httpWrapper(json.dumps({
        'clusterid': clusterid.tolist(),
        'celldata': celldata.tolist()
    }))

def cluster_bio_kmedoids(event, context):
    """ Bio K-Medoids | data:[[]] """
    clusterid, error, nfound = kmedoids(event['body']['data'])
    return httpWrapper(json.dumps({
        'clusterid': clusterid.tolist(),
        'error': error,
        'nfound': nfound
    }))

def cluster_bio_kcluster(event, context):
    """ Bio K-Cluster | data:[[]] """
    clusterid, error, nfound = kcluster(event['body']['data'])
    return httpWrapper(json.dumps({
        'clusterid': clusterid.tolist(),
        'error': error,
        'nfound': nfound
    }))

def cluster_sk_pca(event, context):
    """ SK PCA | components: N, data:[[]] """
    _config = PCA(n_components=event['body']['components'])
    _result = _config.fit(event['body']['data']).transform(event['body']['data'])
    return httpWrapper(json.dumps({
        'result':  json.dumps(_result.tolist()),
        'components': _config.components_.tolist(),
        'varianceExplained': _config.explained_variance_.tolist(),
        'varianceRatio': _config.explained_variance_ratio_.tolist(),
        'singularValues': _config.singular_values_.tolist(),
        'mean': _config.mean_.tolist(),
        'noise': _config.noise_variance_
    }))

def cluster_sk_pca_incremental(event, context):
    """ SK PCA """
    _config = IncrementalPCA(
        n_components=event['body']['components'],
        whiten=event['body']['whiten'],
        copy=True,
        batch_size=None
        )
    _result = _config.fit_transform(event['body']['data'])
    return httpWrapper(json.dumps({
        'result':  _result.tolist(),
        'components': _config.components_.tolist(),
        'varianceExplained': _config.explained_variance_.tolist(),
        'varianceRatio': _config.explained_variance_ratio_.tolist(),
        'singularValues': _config.singular_values_.tolist(),
        'mean': _config.mean_.tolist(),
        'noise': _config.noise_variance_
    }))
    #'cov': _config.get_covariance(),
    #'precision': _config.get_precision()

def cluster_sk_pca_kernal(event, context):
    """ PCA KERNAL """
    _config = KernelPCA(
        n_components=event['body']['components'],
        kernel=event['body']['kernal'],
        gamma=None,
        degree=event['body']['degree'],
        coef0=event['body']['coef0'],
        kernel_params=None,
        alpha=event['body']['alpha'],
        fit_inverse_transform=event['body']['fit_inverse_transform'],
        eigen_solver=event['body']['eigen_solver'],
        tol=event['body']['tol'],
        max_iter=None,
        remove_zero_eig=event['body']['remove_zero_eig'],
        random_state=None,
        copy_X=True,
        n_jobs=-1
        )
    _result = _config.fit_transform(event['body']['data'])
    return httpWrapper(json.dumps({
        'result':  _result.tolist(),
        'components': _config.lambdas_.tolist(),
        'varianceExplained': _config.alphas_.tolist()
        # 'dual_coef_': _config.dual_coef_,
        # 'xtfit': _config.X_transformed_fit_.tolist(),
        # 'mean': _config.X_fit_.tolist()
    }))

def cluster_sk_pca_sparse(event, context):
    """ x """
    _config = SparsePCA(
        n_components=event['body']['components'],
        alpha=event['body']['alpha'],
        ridge_alpha=event['body']['ridge_alpha'],
        max_iter=event['body']['max_iter'],
        tol=event['body']['tol'],
        method=event['body']['fun'],
        n_jobs=-1
    )
    _result = _config.fit_transform(event['body']['data'])
    return httpWrapper(json.dumps({
        'result':  _result.tolist(),
        'components': _config.components_.tolist(),
        'error': _config.error_,
        'iter': _config.n_iter_
    }))



def cluster_sk_linear_discriminant_analysis(event, context):
    """ SK LDA | components: N, data:[[]], classes:[] """
    _config = LinearDiscriminantAnalysis(n_components=event['body']['components'])
    _result = _config.fit(event['body']['data'], event['body']['classes']).transform(event['body']['data'])
    return httpWrapper(json.dumps({
        'result': _result.tolist()
    }))


def cluster_sk_latent_dirichlet_allocation(event, context):
    """ SK LDA """
    _config = LatentDirichletAllocation(
        n_components=event['body']['components'],
        learning_method=event['body']['fun'],
        learning_decay=event['body']['decay'],
        learning_offset=event['body']['offset'],
        mean_change_tol=event['body']['tol'],
        n_jobs=-1)
    _result = _config.fit(event['body']['data']).transform(event['body']['data'])
    return httpWrapper(json.dumps({
        'result': _result.tolist(),
        'components': _config.components_.tolist(),
        'batchIter': _config.n_batch_iter_,
        'iter': _config.n_iter_,
        'perplexity': _config.perplexity(event['body']['data']),
        'score': _config.score(event['body']['data'])
    }))

def cluster_sk_dictionary_learning(event, context):
    """ SK DL | | components: N, data:[[]], alpha: N, tol: N, fit: String, transform: String, split: bool """
    _config = DictionaryLearning(
        n_components=event['body']['components'], 
        fit_algorithm=event['body']['fit'], 
        transform_algorithm=event['body']['transform'], 
        tol=event['body']['tol'],
        alpha=event['body']['alpha'],
        split_sign=event['body']['split'],
        n_jobs=-1)
    _result = _config.fit_transform(event['body']['data'])
    return httpWrapper(json.dumps({
        'result':  _result.tolist(),
        'components': _config.components_.tolist(),
        'error': _config.error_,
        'iter': _config.n_iter_
    }))

def cluster_sk_fast_ica(event, context):
    """ sk fast ica | """
    _config = FastICA(
        n_components=event['body']['components'], 
        whiten=event['body']['whiten'],
        algorithm=event['body']['algorithm'],
        fun=event['body']['fun'], 
        tol=event['body']['tol'])
    _result = _config.fit_transform(event['body']['data']);
    return httpWrapper(json.dumps({
        'result':  _result.tolist(),
        'components': _config.components_.tolist(),
        'mixing': _config.mixing_.tolist(),
        'iter': _config.n_iter_
    }))

def cluster_sk_factor_analysis(event, context):
    """ SK FA | components: N, data:[[]], classes:[] """
    _config = FactorAnalysis(
        n_components=event['body']['components'],
        svd_method=event['body']['fun'])
    _result = _config.fit(event['body']['data']).transform(event['body']['data'])
    return httpWrapper(json.dumps({
        'result': _result.tolist(),
        'loglike': _config.loglike_,
        'noiseVariance':_config.noise_variance_.tolist(),
        'iter': _config.n_iter_
    }))

def cluster_sk_nmf(event, context):
    """ """
    _config = NMF(
        n_components=event['body']['components'],
        #init=event['body']['init'],
        solver=event['body']['solver'],
        #beta_loss=event['body']['betaLoss'],
        tol=event['body']['tol']
        )
    _result = _config.fit_transform(event['body']['data'])
    return httpWrapper(json.dumps({
        'result': _result.tolist(),
        'components': _config.components_.tolist(),
        'err':_config.reconstruction_err_,
        'iter': _config.n_iter_
    }))

def cluster_sk_truncated_svd(event, context):
    """ """
    _config = TruncatedSVD(
        n_components=event['body']['components'],
        algorithm=event['body']['fun'],
        tol=event['body']['tol']
        )
    _result = _config.fit_transform(event['body']['data'])
    return httpWrapper(json.dumps({
        'result': _result.tolist(),
        'components': _config.components_.tolist(),
        'explainedVariance': _config.explained_variance_.tolist(),
        'explainedVarianceRatio': _config.explained_variance_ratio_.tolist(),
        'singularValues': _config.singular_values_.tolist()
    }))

def manifold_sk_tsne(event, context):
    """ SK TSNE """
    _config = TSNE(
        n_components=event['body']['components'],
        perplexity=30.0,
        early_exaggeration=12.0,
        learning_rate=200.0,
        n_iter=1000,
        n_iter_without_progress=300,
        min_grad_norm=1e-7,
        metric="euclidean",
        init="random",
        verbose=0,
        random_state=None,
        method='barnes_hut',
        angle=0.5
        )
    _result = _config.fit_transform(event['body']['data'])
    return httpWrapper(json.dumps({
        'result':  _result.tolist(),
        'embedding': _config.embedding_.tolist(),
        'klDivergence_': _config.kl_divergence_,
        'iter': _config.n_iter_
    }))

def manifold_sk_mds(event, context):
    """ SK MDS """
    _config = MDS(
        n_components=event['body']['components'],
        n_jobs=-1)
    _result = _config.fit_transform(event['body']['data'])
    return httpWrapper(json.dumps({
        'result':  _result.tolist(),
        'embedding': _config.embedding_.tolist(),
        'stress': _config.stress_,
    }))

def manifold_sk_iso_map(event, context):
    """ ISO MAP """
    _config = Isomap(
        n_neighbors=5,
        n_components=3,
        eigen_solver='auto',
        tol = 0,
        max_iter=None,
        path_method='auto',
        neighbors_algorithm='auto',
        n_jobs=-1,
    )
    _result = _config.fit_transform(event['body']['data'])
    return httpWrapper(json.dumps({
        'result':  _result.tolist(),
        'embedding': _config.embedding_.tolist(),
        #'kernalPca': _config.kernel_pca_,
        #'distMatrix': _config.dist_matrix_.tolist()
        #'reconstructionError': _config.reconstruction_error()
    }))

def manifold_sk_local_linear_embedding(event, context):
    """ http://scikit-learn.org/stable/modules/generated/sklearn.manifold.Isomap.html#sklearn.manifold.Isomap """
    _config = LocallyLinearEmbedding(
        n_neighbors=5,
        n_components=3,
        reg=1E-3,
        eigen_solver='auto',
        tol=1E-6,
        max_iter=100,
        method='standard',
        hessian_tol=1E-4,
        modified_tol=1E-12,
        neighbors_algorithm='auto',
        random_state=None,
        n_jobs=-1
    )
    _result = _config.fit_transform(event['body']['data'])
    return httpWrapper(json.dumps({
        'result':  _result.tolist(),
        'reconstructionError': _config.reconstruction_error_
    }))

def manifold_sk_spectral_embedding(event, context):
    """ http://scikit-learn.org/stable/modules/generated/sklearn.manifold.Isomap.html#sklearn.manifold.Isomap """
    _config = SpectralEmbedding(
        n_components=3,
        affinity="nearest_neighbors",
        gamma=None,
        random_state=None,
        eigen_solver=None,
        n_neighbors=None,
        n_jobs=-1
    )
    _result = _config.fit_transform(event['body']['data'])
    return httpWrapper(json.dumps({
        'result':  _result.tolist(),
        'embedding': _config.embedding_.tolist()
    }))
    #'affinityMatrix': _config.affinity_matrix_.tolist()


def main(event, context):
    """ Gateway """
    function_to_invoke = {
        'cluster_bio_pca': cluster_bio_pca,
        'cluster_bio_tree': cluster_bio_tree,
        'cluster_bio_centroids': cluster_bio_centroids,
        'cluster_bio_som': cluster_bio_som,
        'cluster_bio_kmedoids': cluster_bio_kmedoids,
        'cluster_bio_kcluster': cluster_bio_kcluster,
        'cluster_sk_pca': cluster_sk_pca,
        'cluster_sk_pca_incremental': cluster_sk_pca_incremental,
        'cluster_sk_pca_kernal': cluster_sk_pca_kernal,
        'cluster_sk_pca_sparse': cluster_sk_pca_sparse,
        'cluster_sk_linear_discriminant_analysis': cluster_sk_linear_discriminant_analysis,
        'cluster_sk_latent_dirichlet_allocation': cluster_sk_latent_dirichlet_allocation,
        'cluster_sk_factor_analysis': cluster_sk_factor_analysis,
        'cluster_sk_nmf': cluster_sk_nmf,
        'cluster_sk_fast_ica': cluster_sk_fast_ica,
        'cluster_sk_dictionary_learning': cluster_sk_dictionary_learning,
        'cluster_sk_truncated_svd': cluster_sk_truncated_svd,
        'manifold_sk_mds': manifold_sk_mds,
        'manifold_sk_tsne': manifold_sk_tsne,
        'manifold_sk_iso_map': manifold_sk_iso_map,
        'manifold_sk_spectral_embedding': manifold_sk_spectral_embedding,
        'manifold_sk_local_linear_embedding': manifold_sk_local_linear_embedding
    }.get(event['body']['method'], echo)
    return function_to_invoke(event, context)
