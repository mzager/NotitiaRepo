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

from sklearn.cluster import AffinityPropagation
from sklearn.cluster import Birch
from sklearn.cluster import DBSCAN
from sklearn.cluster import FeatureAgglomeration
from sklearn.cluster import KMeans
from sklearn.cluster import MiniBatchKMeans
from sklearn.cluster import MeanShift
from sklearn.cluster import SpectralClustering

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
    _config = PCA(
        n_components=event['body']['components'],
        copy=event['body']['copy'],
        whiten=event['body']['whiten'],
        svd_solver=event['svd_solver'],
        tol = event['body']['tol'],
        iterated_power= event['body']['iterated_power'],
        random_state= None if (event['body']['random_state']=='None') else event['body']['random_state']
        )

    _result = _config.fit(event['body']['data']).transform(event['body']['data'])
    return httpWrapper(json.dumps({
        'result':  _result.tolist(),
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
        tol=event['body']['tol']
    )
    _result = _config.fit_transform(event['body']['data'])
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
        svd_method=event['body']['fun'],
        tol=event['body']['tol'])
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
        algorithm=event['body']['algorithm'],
        tol=event['body']['tol'],
        n_iter=event['body']['n_iter']
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
        perplexity=event['body']['perplexity'],
        early_exaggeration=event['body']['early_exaggeration'],
        learning_rate=event['body']['learning_rate'],
        n_iter=event['body']['n_iter'],
        n_iter_without_progress=event['body']['n_iter_without_progress'],
        min_grad_norm=event['body']['min_grad_norm'],
        metric=event['body']['metric'],
        init=event['body']['init'],
        verbose=event['body']['verbose'],
        random_state=event['body']['random_state'],
        method=event['body']['method'],
        angle=event['body']['angle']
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
        n_neighbors=event['body']['n_neighbors'],
        n_components=event['body']['components'],
        eigen_solver=event['body']['eigen_solver'],
        tol = event['body']['tol'],
        max_iter=event['body']['max_iter'],
        path_method=event['body']['path_method'],
        neighbors_algorithm=event['body']['neighbors_algorithm'],
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
        n_neighbors=event['body']['n_neighbors'],
        n_components=event['body']['components'],
        reg=event['body']['reg'],
        eigen_solver=event['body']['eigen_solver'],
        tol=event['body']['tol'],
        max_iter=event['body']['max_iter'],
        method=event['body']['lle_method'],
        hessian_tol=event['body']['hessian_tol'],
        modified_tol=event['body']['modified_tol'],
        neighbors_algorithm=event['body']['neighbors_algorithm'],
        random_state = None if (event['body']['random_state']=='None') else event['body']['random_state'],
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
        n_components=event['body']['components'],
        affinity=event['body']['affinity'],
        gamma = None if (event['body']['gamma']=='None') else event['body']['gamma'],
        random_state = None if (event['body']['random_state']=='None') else event['body']['random_state'],
        eigen_solver = None if (event['body']['eigen_solver']=='None') else event['body']['random_state'],
        n_neighbors = None if (event['body']['n_neighbors']=='None') else event['body']['n_neighbors'],
        n_jobs=-1
    )
    _result = _config.fit_transform(event['body']['data'])
    return httpWrapper(json.dumps({
        'result':  _result.tolist(),
        'embedding': _config.embedding_.tolist()
    }))
    #'affinityMatrix': _config.affinity_matrix_.tolist()
def cluster_sk_affinity_propagation(event, context):
    """ AffinityPropagation """
    _config = AffinityPropagation(
        damping = event['body']['damping'],
        max_iter = event['body']['max_iter'],
        convergence_iter = event['body']['convergence_iter'],
        copy = event['body']['copy'],
        preference = event['body']['preference'],
        affinity = event['body']['affinity'],
        verbose = event['body']['verbose']
    )
    _result = _config.fit_predict(event['body']['data'])
    return httpWrapper( json.dumps({
        'result': _result.tolist(),
        'cluster_centers_indices': _config.cluster_centers_indices_,
        'cluster_centers': _config.cluster_centers_,
        'labels': _config.labels_,
        # 'affinity_matrix': affinity_matrix_,
        'affinity_matrix': _configaffinity_matrix_,
        'n_iter':  _config.n_iter_
    }))

def cluster_sk_birch(event, context):
    """ Birch """
    _config = Birch(
        eps = event['body']['eps'],
        min_samples = event['body']['min_samples'],
        metric = event['body']['metric'],
        metric_params = event['body']['metric_params'],
        algorithm = event['body']['algorithm'],
        leaf_size = event['body']['leaf_size'],
        p = event['body']['p'],
        n_jobs = event['body']['n_jobs']
    )
    _result = _config.fit_predict(event['body']['data'])
    return httpWrapper( json.dumps({
        'result': _result.tolist(),
        'root': _config.root,
        'dummy_leaf': _config.dummy_leaf_,
        'subcluster_centers': _config.subcluster_centers_,
        'subcluster_labels': _config.subcluster_labels_,
        'labels': _config.affinity_matrix_
    }))
def cluster_sk_dbscan(event, context):
    """ DBSCAN """
    _config = DBSCAN(
        threshold = event['body']['threshold'],
        branching_factor = event['body']['branching_factor'],
        n_clusters = event['body']['n_clusters'],
        compute_labels = event['body']['compute_labels'],
        copy = event['body']['copy']
    )
    _result = _config.fit_predict(event['body']['data'])
    return httpWrapper( json.dumps({
        'result': _result.tolist(),
        'core_sample_indices': _config.core_sample_indices_,
        'components': _config.components_,
        'labels': _config.labels_
    }))
def cluster_sk_feature_agglomeration(event, context):
    """ FeatureAgglomeration """
    _config = FeatureAgglomeration(
        n_clusters = event['body']['n_clusters'],
        affinity = event['body']['affinity'],
        memory = event['body']['memory'],
        connectivity = event['body']['connectivity'],
        compute_full_tree = event['body']['compute_full_tree'],
        linkage = event['body']['linkage'],
        pooling_func = event['body']['pooling_func']
    )
    _result = _config.fit_predict(event['body']['data'])
    return httpWrapper( json.dumps({
        'result': _result.tolist(),
        'core_sample_indices': _config.labels_,
        'n_leaves': _config.n_leaves_,
        'n_components': _config.n_components_,
        'children': _config.children_
    }))

def cluster_sk_kmeans(event, context):
    """ KMeans """
    _config = KMeans(
        n_clusters = event['body']['n_clusters'],
        init = event['body']['init'],
        n_init = event['body']['n_init'],
        max_iter = event['body']['max_iter'],
        tol = event['body']['tol'],
        precompute_distances = event['body']['precompute_distances'],
        verbose = event['body']['verbose'],
        random_state = event['body']['random_state'],
        copy_x = event['body']['copy_x'],
        n_jobs = event['body']['n_jobs'],
        algorithm = event['body']['algorithm']
    )
    _result = _config.fit_predict(event['body']['data'])
    return httpWrapper( json.dumps({
        'result': _result.tolist(),
        'cluster_centers': _config.cluster_centers_,
        'labels': _config.labels_,
        'inertia': _config.inertia_
    }))

def cluster_sk_mini_batch_kmeans(event, context):
    """ MiniBatchKMeans """
    _config = MiniBatchKMeans(
        n_clusters = event['body']['n_clusters'],
        init = event['body']['init'],
        max_iter = event['body']['max_iter'],
        batch_size = event['body']['batch_size'],
        verbose = event['body']['verbose'],
        compute_labels = event['body']['compute_labels'],
        random_state = event['body']['random_state'],
        tol = event['body']['tol'],
        max_no_improvement = event['body']['max_no_improvement'],
        init_size = event['body']['init_size'],
        n_init = event['body']['n_init'],
        reassignment_ratio = event['body']['reassignment_ratio']
    )
    _result = _config.fit_predict(event['body']['data'])
    return httpWrapper( json.dumps({
        'result': _result.tolist(),
        'cluster_centers': _config.cluster_centers_,
        'labels': _config.labels_,
        'inertia': _config.inertia_
    }))

def cluster_sk_mean_shift(event, context):
    """ MeanShift """
    _config = MeanShift(
        bandwidth = event['body']['bandwidth'],
        seeds = event['body']['seeds'],
        bin_seeding = event['body']['bin_seeding'],
        min_bin_freq = event['body']['min_bin_freq'],
        cluster_all = event['body']['cluster_all'],
        n_jobs = event['body']['n_jobs']
    )
    _result = _config.fit_predict(event['body']['data'])
    return httpWrapper( json.dumps({
        'result': _result.tolist(),
        'cluster_centers': _config.cluster_centers_,
        'labels': _config.labels_
    }))

def cluster_sk_spectral_clustering(event, context):
    """ SpectralClustering """
    _config = SpectralClustering(
        n_clusters = event['body']['n_clusters'],
        eigen_solver = event['body']['eigen_solver'],
        random_state = event['body']['random_state'],
        n_init = event['body']['n_init'],
        gamma = event['body']['gamma'],
        affinity = event['body']['affinity'],
        n_neighbors = event['body']['n_neighbors'],
        eigen_tol = event['body']['eigen_tol'],
        assign_labels = event['body']['assign_labels'],
        degree = event['body']['degree'],
        coef0 = event['body']['coef0'],
        kernel_params = event['body']['kernel_params'],
        n_jobs = event['body']['n_jobs']
    )
    _result = _config.fit_predict(event['body']['data'])
    return httpWrapper( json.dumps({
        'result': _result.tolist(),
        'affinity_matrix': _config.affinity_matrix_,
        'labels': _config.labels_
    }))

def discriminant_analysis_sk_linear(event, context):
    """ discriminant_analysis_LinearDiscriminantAnalysis """
    _config = LinearDiscriminantAnalysis(
        solver = event['body']['solver'],
        shrinkage = event['body']['shrinkage'],
        priors = event['body']['priors'],
        n_components = event['body']['n_components'],
        store_covariance = event['body']['store_covariance'],
        tol = event['body']['tol']
    )
    _result = _config.fit_predict(event['body']['data'])
    return httpWrapper( json.dumps({
        'result': _result.tolist(),
        'coef': _config.coef_,
        'intercept': _config.intercept_,
        'covariance': _config.covariance_,
        'explained_variance_ratio': _config.explained_variance_ratio_,
        'means': _config.means_,
        'priors': _config.priors_,
        'scalings': _config.scalings_,
        'xbar': _config.xbar_,
        'classes': _config.classes_
    }))

def discriminant_analysis_sk_quadratic(event, context):
    """ discriminant_analysis_sk_QuadraticDiscriminantAnalysis """
    _config = QuadraticDiscriminantAnalysis(
        priors = event['body']['priors'],
        reg_param = event['body']['reg_param'],
        store_covariance = event['body']['store_covariance'],
        tol = event['body']['tol']
    )
    _result = _config.fit_predict(event['body']['data'])
    return httpWrapper( json.dumps({
        'result': _result.tolist(),
        'covariance': _config.covariance_,
        'means': _config.means_, 
        'priors': _config.priors_,
        'rotations': _config.rotations_, 
        'scalings': _config.scalings_
    }))

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
        'manifold_sk_local_linear_embedding': manifold_sk_local_linear_embedding,
        'cluster_sk_affinity_propagation': cluster_sk_affinity_propagation,
        'cluster_sk_birch': cluster_sk_birch,
        'cluster_sk_dbscan': cluster_sk_dbscan,
        'cluster_sk_feature_agglomeration': cluster_sk_feature_agglomeration,
        'cluster_sk_kmeans': cluster_sk_kmeans,
        'cluster_sk_mini_batch_kmeans': cluster_sk_mini_batch_kmeans,
        'cluster_sk_mean_shift': cluster_sk_mean_shift,
        'cluster_sk_spectral_clustering': cluster_sk_spectral_clustering,
        'discriminant_analysis_sk_linear': discriminant_analysis_sk_linear,
        'discriminant_analysis_sk_quadratic': discriminant_analysis_sk_quadratic


    }.get(event['body']['method'], echo)
    return function_to_invoke(event, context)
