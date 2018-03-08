# from eve import Eve
from flask import Flask
from flask_cors import CORS

import json
import base64
from flask import request
from flask import jsonify
from flask import Response

from sklearn.manifold import MDS
from sklearn.manifold import TSNE
from sklearn.manifold import Isomap
from sklearn.manifold import LocallyLinearEmbedding
from sklearn.manifold import SpectralEmbedding

from sklearn.decomposition import PCA
from sklearn.decomposition import IncrementalPCA
from sklearn.decomposition import MiniBatchSparsePCA
from sklearn.decomposition import MiniBatchDictionaryLearning
from sklearn.decomposition import SparseCoder
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
from sklearn.discriminant_analysis import QuadraticDiscriminantAnalysis

from sklearn.cluster import AgglomerativeClustering
from sklearn.cluster import AffinityPropagation
from sklearn.cluster import Birch
from sklearn.cluster import DBSCAN
from sklearn.cluster import FeatureAgglomeration
from sklearn.cluster import KMeans
from sklearn.cluster import MiniBatchKMeans
from sklearn.cluster import MeanShift
from sklearn.cluster import SpectralClustering

import pandas as pd
import sys, numpy, scipy
import scipy.cluster.hierarchy as hier
import scipy.spatial.distance as dist

from lifelines import KaplanMeierFitter
from lifelines import NelsonAalenFitter
from lifelines import CoxPHFitter
from lifelines import AalenAdditiveFitter


def httpWrapper(content):
    return Response(content, status=200, mimetype='application/json')

def echo(content):
    return httpWrapper(json.dumps(content))

def survival_ll_kaplan_meier(content):
    T = numpy.array(content['times'], dtype=int)
    E = numpy.array(content['events'], dtype=bool)
    kmf = KaplanMeierFitter()
    kmf.fit(T,E)
    return httpWrapper( json.dumps({
		'result': kmf.survival_function_.to_dict(),
		'confidence': kmf.confidence_interval_.to_dict(),
		'median': kmf.median_
		}))

def survival_ll_nelson_aalen(content):
	kmf = NelsonAalenFitter()
	kmf.fit(content['times'], event_observed=content['events'])
	return httpWrapper( json.dumps({
		'result': kmf.survival_function_,
		'hazard': cumulative_hazard_,
		'median': kmf.kmf.median_
		}))

def cluster_sp_agglomerative(content):
    """ Agglomerative Clustering """
    if content['transpose'] == 1:
        content['data'] = list(map(list, zip(*content['data'])))
    dataMatrix = numpy.array(content['data'])
    linkageMatrix = hier.linkage(dataMatrix,
        method=content['sp_method'],
        metric=content['sp_metric'],
        optimal_ordering=content['sp_ordering'] == 1)
    heatmapOrder = hier.leaves_list(linkageMatrix)
    orderedDataMatrix = dataMatrix[heatmapOrder,:]
    return httpWrapper( json.dumps({
		'result': orderedDataMatrix.tolist(),
		'order': heatmapOrder.tolist(),
		'dendo': hier.dendrogram(linkageMatrix, no_plot=True)
	}))

def cluster_sk_pca(content):
    """ SK PCA | components: N, data:[[]] """
    _config = PCA(
        n_components=content['n_components'],
        copy=content['copy'],
        whiten=content['whiten'],
        svd_solver=content['svd_solver'],
        tol = content['tol'],
        iterated_power= content['iterated_power'],
        random_state= None if (content['random_state']=='None') else content['random_state']
        )

    _result = _config.fit(content['data']).transform(content['data'])
    return httpWrapper(json.dumps({
        'result':  _result.tolist(),
        'components': _config.components_.tolist(),
        'explainedVariance': _config.explained_variance_.tolist(),
        'explainedVarianceRatio': _config.explained_variance_ratio_.tolist(),
        'singularValues': _config.singular_values_.tolist(),
        'mean': _config.mean_.tolist(),
        'nComponents': _config.n_components_,
        'noiseVariance': _config.noise_variance_
    }))

def cluster_sk_pca_incremental(content):
    """ SK PCA """
    _config = IncrementalPCA(
        n_components = content['n_components'],
        whiten = content['whiten']
        )
    _result = _config.fit_transform(content['data'])
    return httpWrapper(json.dumps({
        'result':  _result.tolist(),
        'components': _config.components_.tolist(),
        'explainedVariance': _config.explained_variance_.tolist(),
        'explainedVarianceRatio': _config.explained_variance_ratio_.tolist(),
        'singularValues': _config.singular_values_.tolist(),
        'skVar': _config.var_.tolist(),
        'mean': _config.mean_.tolist(),
        'nComponents': _config.n_components_,
        'noiseVariance': _config.noise_variance_,
        'nSamplesSeen': _config.n_samples_seen_
    }))

def cluster_sk_pca_kernal(content):
    """ PCA KERNAL """
    _config = KernelPCA(
        n_components=content['n_components'],
        kernel=content['kernel'],
        gamma=None,
        degree=content['degree'],
        coef0=content['coef0'],
        kernel_params=None,
        alpha=content['alpha'],
        fit_inverse_transform=content['fit_inverse_transform'],
        eigen_solver=content['eigen_solver'],
        tol=content['tol'],
        max_iter=None,
        remove_zero_eig=content['remove_zero_eig'],
        random_state=None,
        copy_X=True,
        n_jobs=-1
        )
    _result = _config.fit_transform(content['data'])
    return httpWrapper(json.dumps({
        'result':  _result.tolist(),
        'lambdas':  _config.lambdas_.tolist(),
        'alphas':  _config.alphas_.tolist(),
        #'dualCoef':  _config.dual_coef_.tolist(),
        #'X_transformed_fit_': _config.X_transformed_fit_.tolist(),
        #'X_fit_': _config.X_fit_
        }))

def cluster_sk_pca_sparse(content):
    """ x """
    _config = SparsePCA(
        n_components=content['n_components'],
        alpha=content['alpha'],
        ridge_alpha=content['ridge_alpha'],
        max_iter=content['max_iter'],
        tol=content['tol'],
        method=content['sk_method'],
        n_jobs=-1
    )
    _result = _config.fit_transform(content['data'])
    return httpWrapper(json.dumps({
        'result':  _result.tolist(),
        'components': _config.components_.tolist(),
        'error': _config.error_,
        'iter': _config.n_iter_
    }))

def cluster_sk_sparse_coder(content):
    """ x """
    _config = SparseCoder(
        n_components=content['n_components'],
        alpha=content['alpha'],
        ridge_alpha=content['ridge_alpha'],
        max_iter=content['max_iter'],
        tol=content['tol'],
        method=content['sk_method'],
        n_jobs=-1
    )
    _result = _config.fit_transform(content['data'])
    return httpWrapper(json.dumps({
        'result':  _result.tolist(),
        'components': _config.components_.tolist(),
        'error': _config.error_,
        'iter': _config.n_iter_
    }))

def cluster_sk_mini_batch_dictionary_learning(content):
    """ x """
    _config = MiniBatchDictionaryLearning(
        n_components=content['n_components'],
        alpha=content['alpha'],
        n_iter=content['n_iter'], 
        fit_algorithm=content['fit_algorithm'], 
        n_jobs=1, 
        batch_size=content['batch_size'], 
        shuffle=content['shuffle'], 
        dict_init=None, 
        transform_algorithm=content['transform_algorithm'], 
        transform_n_nonzero_coefs=None, 
        transform_alpha=None, 
        verbose=False, 
        split_sign=content['split_sign'], 
        random_state=None
    )
    _result = _config.fit_transform(content['data'])
    return httpWrapper(json.dumps({
        'result':  _result.tolist(),
        'components': _config.components_.tolist(),
        'iter': _config.n_iter_
    }))

def cluster_sk_mini_batch_sparse_pca(content):
    """ x """
    _config = MiniBatchSparsePCA(
        n_components=content['n_components'],
        alpha=content['alpha'],
        ridge_alpha=content['ridge_alpha'],
        n_iter=content['n_iter'], 
        callback=None,
        batch_size=content['batch_size'],
        verbose=0,
        shuffle=content['shuffle'],
        n_jobs=-1,
        method=content['sk_method'],
        random_state=None
    )
    _result = _config.fit_transform(content['data'])
    return httpWrapper(json.dumps({
        'result':  _result.tolist(),
        'components': _config.components_.tolist(),
        'iter': _config.n_iter_
    }))

def cluster_sk_linear_discriminant_analysis(content):
    """ SK LDA | components: N, data:[[]], classes:[] """
    _config = LinearDiscriminantAnalysis(n_components=content['components'])
    _result = _config.fit(content['data'], content['classes']).transform(content['data'])
    return httpWrapper(json.dumps({
        'result': _result.tolist()
    }))


def cluster_sk_latent_dirichlet_allocation(content):
    """ SK LDA """
    _config = LatentDirichletAllocation(
        n_components=content['n_components'],
        doc_topic_prior=None,
        topic_word_prior=None,
        learning_method=content['learning_method'],
        learning_decay=content['learning_decay'],
        learning_offset=content['learning_offset'],
        max_iter=10,
        batch_size=128,
        mean_change_tol=content['mean_change_tol'],
        n_jobs=-1)
    _result = _config.fit(content['data']).transform(content['data'])
    return httpWrapper(json.dumps({
        'result': _result.tolist(),
        'components': _config.components_.tolist(),
        'batchIter': _config.n_batch_iter_,
        'nIter': _config.n_iter_,
        'perplexity': _config.perplexity(content['data']),
        'score': _config.score(content['data'])
    }))


def cluster_sk_dictionary_learning(content):
    """ SK DL | | components: N, data:[[]], alpha: N, tol: N, fit: String, transform: String, split: bool """
    _config = DictionaryLearning(
        n_components=content['n_components'], 
        alpha=content['alpha'],
        max_iter=content['max_iter'],
        tol=content['tol'],
        fit_algorithm=content['fit_algorithm'], 
        transform_algorithm=content['transform_algorithm'], 
        split_sign=content['split_sign'],
        n_jobs=-1)
    _result = _config.fit_transform(content['data'])
    return httpWrapper(json.dumps({
        'result':  _result.tolist(),
        'components': _config.components_.tolist(),
        'error': _config.error_,
        'nIter': _config.n_iter_
    }))

def cluster_sk_fast_ica(content):
    """ sk fast ica | """
    _config = FastICA(
        n_components=content['n_components'], 
        algorithm=content['algorithm'],
        whiten=content['whiten'],
        fun=content['fun'], 
        tol=content['tol']
    )
    _result = _config.fit_transform(content['data'])
    return httpWrapper(json.dumps({
        'result':  _result.tolist(),
        'components': _config.components_.tolist(),
        'mixing': _config.mixing_.tolist(),
        'nIter': _config.n_iter_
    }))

def cluster_sk_factor_analysis(content):
    """ SK FA | components: N, data:[[]], classes:[] """
    _config = FactorAnalysis(
        n_components=content['n_components'],
        svd_method=content['svd_method'],
        tol=content['tol'])
    _result = _config.fit(content['data']).transform(content['data'])
    return httpWrapper(json.dumps({
        'result': _result.tolist(),
        'loglike': _config.loglike_,
        'noiseVariance':_config.noise_variance_.tolist(),
        'nIter': _config.n_iter_
    }))

def cluster_sk_nmf(content):
    """ """
    _config = NMF(
        n_components=content['n_components'],
        init=content['init'],
        solver=content['solver'],
        beta_loss=content['beta_loss'],
        tol=content['tol']
        )
    _result = _config.fit_transform(content['data'])
    return httpWrapper(json.dumps({
        'result': _result.tolist(),
        'components': _config.components_.tolist(),
        'reconstruction_err':_config.reconstruction_err_,
        'nIter': _config.n_iter_
    }))

def cluster_sk_truncated_svd(content):
    """ """
    _config = TruncatedSVD(
        n_components=content['n_components'],
        algorithm=content['algorithm'],
        tol=content['tol'],
        n_iter=content['n_iter']
        )
    _result = _config.fit_transform(content['data'])
    return httpWrapper(json.dumps({
        'result': _result.tolist(),
        'components': _config.components_.tolist(),
        'explainedVariance': _config.explained_variance_.tolist(),
        'explainedVarianceRatio': _config.explained_variance_ratio_.tolist(),
        'singularValues': _config.singular_values_.tolist()
    }))

def manifold_sk_tsne(content):
    """ SK TSNE """
    _config = TSNE(
        n_components=content['n_components'],
        perplexity=content['perplexity'],
        early_exaggeration=content['early_exaggeration'],
        learning_rate=content['learning_rate'],
        n_iter=content['n_iter'],
        n_iter_without_progress=content['n_iter_without_progress'],
        min_grad_norm=content['min_grad_norm'],
        metric=content['metric'],
        method=content['sk_method']
        )
    _result = _config.fit_transform(content['data'])
    return httpWrapper(json.dumps({
        'result':  _result.tolist(),
        'embedding': _config.embedding_.tolist(),
        'klDivergence': _config.kl_divergence_,
        'nIter': _config.n_iter_
    }))

def manifold_sk_mds(content):
    """ SK MDS """
    _config = MDS(
        n_components=content['n_components'],
        metric=content['metric'],
        eps=content['eps'],
        dissimilarity=content['dissimilarity'],
        n_jobs=-1)
    _result = _config.fit_transform(content['data'])
    return httpWrapper(json.dumps({
        'result':  _result.tolist(),
        'embedding': _config.embedding_.tolist(),
        'stress': _config.stress_,
    }))

def manifold_sk_iso_map(content):
    """ ISO MAP """
    _config = Isomap(
        n_neighbors=content['n_neighbors'],
        n_components=content['n_components'],
        eigen_solver=content['eigen_solver'],
        tol = content['tol'],
        path_method=content['path_method'],
        neighbors_algorithm=content['neighbors_algorithm'],
        n_jobs=-1,
    )
    _result = _config.fit_transform(content['data'])
    return httpWrapper(json.dumps({
        'result':  _result.tolist(),
        'embedding': _config.embedding_.tolist()
        #'kernalPca': _config.kernel_pca_,
        #'distMatrix': _config.dist_matrix_.tolist()
        #'reconstructionError': _config.reconstruction_error()
    }))

def manifold_sk_local_linear_embedding(content):
    """ http://scikit-learn.org/stable/modules/generated/sklearn.manifold.Isomap.html#sklearn.manifold.Isomap """
    _config = LocallyLinearEmbedding(
        n_neighbors=content['n_neighbors'],
        n_components=content['n_components'],
        reg=content['reg'],
        eigen_solver=content['eigen_solver'],
        tol=content['tol'],
        method=content['lle_method'],
        hessian_tol=content['hessian_tol'],
        modified_tol=content['modified_tol'],
        neighbors_algorithm=content['neighbors_algorithm'],
        n_jobs=-1
    )
    _result = _config.fit_transform(content['data'])
    return httpWrapper(json.dumps({
        'result':  _result.tolist(),
        'reconstructionError': _config.reconstruction_error_
    }))

def manifold_sk_spectral_embedding(content):
    """ http://scikit-learn.org/stable/modules/generated/sklearn.manifold.Isomap.html#sklearn.manifold.Isomap """
    _config = SpectralEmbedding(
        n_components=content['n_components'],
        affinity=content['affinity'],
        gamma = None if (content['gamma']=='None') else content['gamma'],
        eigen_solver = None if (content['eigen_solver']=='None') else content['eigen_solver'],
        n_neighbors = None if (content['n_neighbors']=='None') else content['n_neighbors'],
        n_jobs=-1
    )
    _result = _config.fit_transform(content['data'])
    return httpWrapper(json.dumps({
        'result':  _result.tolist()
        # 'embedding': _config.embedding_.tolist(),
        # 'affinityMatrix': _config.affinity_matrix_.tolist()
    }))

def cluster_sk_affinity_propagation(content):
    """ AffinityPropagation """
    _config = AffinityPropagation(
        damping = content['damping'],
        max_iter = content['max_iter'],
        convergence_iter = content['convergence_iter'],
        copy = content['copy'],
        preference = content['preference'],
        affinity = content['affinity'],
        verbose = content['verbose']
    )
    _result = _config.fit_predict(content['data'])
    return httpWrapper( json.dumps({
        'result': _result.tolist(),
        'cluster_centers_indices': _config.cluster_centers_indices_,
        'cluster_centers': _config.cluster_centers_,
        'labels': _config.labels_,
        # 'affinity_matrix': affinity_matrix_,
        'affinity_matrix': _configaffinity_matrix_,
        'n_iter':  _config.n_iter_
    }))

def cluster_sk_birch(content):
    """ Birch """
    _config = Birch(
        eps = content['eps'],
        min_samples = content['min_samples'],
        metric = content['metric'],
        metric_params = content['metric_params'],
        algorithm = content['algorithm'],
        leaf_size = content['leaf_size'],
        p = content['p'],
        n_jobs = content['n_jobs']
    )
    _result = _config.fit_predict(content['data'])
    return httpWrapper( json.dumps({
        'result': _result.tolist(),
        'root': _config.root,
        'dummy_leaf': _config.dummy_leaf_,
        'subcluster_centers': _config.subcluster_centers_,
        'subcluster_labels': _config.subcluster_labels_,
        'labels': _config.affinity_matrix_
    }))
def cluster_sk_dbscan(content):
    """ DBSCAN """
    _config = DBSCAN(
        threshold = content['threshold'],
        branching_factor = content['branching_factor'],
        n_clusters = content['n_clusters'],
        compute_labels = content['compute_labels'],
        copy = content['copy']
    )
    _result = _config.fit_predict(content['data'])
    return httpWrapper( json.dumps({
        'result': _result.tolist(),
        'core_sample_indices': _config.core_sample_indices_,
        'components': _config.components_,
        'labels': _config.labels_
    }))


def cluster_sk_agglomerative(content):
    if content['transpose'] == 1:
    	content['data'] = list(map(list, zip(*content['data'])))
    _config = AgglomerativeClustering(
        n_clusters = len(content['data']), #content['n_clusters'],
        affinity = content['affinity'],
        linkage = content['linkage'],
    )
    _result = _config.fit_predict(content['data'])
    return httpWrapper( json.dumps({
        'result': _result.tolist(),
        'n_leaves': _config.n_leaves_,
        'n_components': _config.n_components_,
        'labels': _config.labels_.tolist(),
        'children': _config.children_.tolist(),
    }))

def cluster_sk_feature_agglomeration(content):
    """ FeatureAgglomeration """
    _config = FeatureAgglomeration(
        n_clusters = content['n_clusters'],
        affinity = content['affinity'],
        memory = content['memory'],
        connectivity = content['connectivity'],
        compute_full_tree = content['compute_full_tree'],
        linkage = content['linkage'],
        pooling_func = content['pooling_func']
    )
    _result = _config.fit_predict(content['data'])
    return httpWrapper( json.dumps({
        'result': _result.tolist(),
        'core_sample_indices': _config.labels_,
        'n_leaves': _config.n_leaves_,
        'n_components': _config.n_components_,
        'children': base64.b64encode(_config.children_)
    }))

def cluster_sk_kmeans(content):
    """ KMeans """
    _config = KMeans(
        n_clusters = content['n_clusters'],
        init = content['init'],
        n_init = content['n_init'],
        max_iter = content['max_iter'],
        tol = content['tol'],
        precompute_distances = content['precompute_distances'],
        verbose = content['verbose'],
        random_state = content['random_state'],
        copy_x = content['copy_x'],
        n_jobs = content['n_jobs'],
        algorithm = content['algorithm']
    )
    _result = _config.fit_predict(content['data'])
    return httpWrapper( json.dumps({
        'result': _result.tolist(),
        'cluster_centers': _config.cluster_centers_,
        'labels': _config.labels_,
        'inertia': _config.inertia_
    }))

def cluster_sk_mini_batch_kmeans(content):
    """ MiniBatchKMeans """
    _config = MiniBatchKMeans(
        n_clusters = content['n_clusters'],
        init = content['init'],
        max_iter = content['max_iter'],
        batch_size = content['batch_size'],
        verbose = content['verbose'],
        compute_labels = content['compute_labels'],
        random_state = content['random_state'],
        tol = content['tol'],
        max_no_improvement = content['max_no_improvement'],
        init_size = content['init_size'],
        n_init = content['n_init'],
        reassignment_ratio = content['reassignment_ratio']
    )
    _result = _config.fit_predict(content['data'])
    return httpWrapper( json.dumps({
        'result': _result.tolist(),
        'cluster_centers': _config.cluster_centers_,
        'labels': _config.labels_,
        'inertia': _config.inertia_
    }))

def cluster_sk_mean_shift(content):
    """ MeanShift """
    _config = MeanShift(
        bandwidth = content['bandwidth'],
        seeds = content['seeds'],
        bin_seeding = content['bin_seeding'],
        min_bin_freq = content['min_bin_freq'],
        cluster_all = content['cluster_all'],
        n_jobs = content['n_jobs']
    )
    _result = _config.fit_predict(content['data'])
    return httpWrapper( json.dumps({
        'result': _result.tolist(),
        'cluster_centers': _config.cluster_centers_,
        'labels': _config.labels_
    }))

def cluster_sk_spectral(content):
    """ SpectralClustering """
    _config = SpectralClustering(
        n_clusters = content['n_clusters'],
        eigen_solver = content['eigen_solver'],
        random_state = content['random_state'],
        n_init = content['n_init'],
        gamma = content['gamma'],
        affinity = content['affinity'],
        n_neighbors = content['n_neighbors'],
        eigen_tol = content['eigen_tol'],
        assign_labels = content['assign_labels'],
        degree = content['degree'],
        coef0 = content['coef0'],
        kernel_params = content['kernel_params'],
        n_jobs = content['n_jobs']
    )
    _result = _config.fit_predict(content['data'])
    return httpWrapper( json.dumps({
        'result': _result.tolist(),
        'affinity_matrix': _config.affinity_matrix_,
        'labels': _config.labels_
    }))

def manifold_sk_lineardiscriminantanalysis(content):
    """ discriminant_analysis_LinearDiscriminantAnalysis """
    _config = LinearDiscriminantAnalysis(
        solver = content['solver'],
        shrinkage = None if (content['shrinkage']=='None') else content['shrinkage'],
        priors = None,
        n_components = content['n_components'],
        store_covariance = content['store_covariance'],
        tol = content['tol']
    )
    _result = _config.fit_transform(content['data'], y=None)
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

def manifold_sk_quadradicdiscriminantanalysis(content):
    """ discriminant_analysis_sk_QuadraticDiscriminantAnalysis """
    _config = QuadraticDiscriminantAnalysis(
        priors = None,
        reg_param = 0.0, #content['reg_param'],
        store_covariance = content['store_covariance'],
        tol = content['tol']
    )
    _result = _config.fit_transform(content['data'])
    return httpWrapper( json.dumps({
        'result': _result.tolist(),
        'covariance': _config.covariance_,
        'means': _config.means_, 
        'priors': _config.priors_,
        'rotations': _config.rotations_, 
        'scalings': _config.scalings_
    }))



# Start Eve Stuff
# def on_fetched_resource(resource, response):
#     for doc in response['_items']:
#         for field in doc.keys():
#             if field.startswith('_'):
#                 del(doc[field])

# app = Eve(settings='settings.py')
# app.on_fetched_resource += on_fetched_resource
app = Flask(__name__)
CORS(app)
@app.route('/')
def hello():
    return "Hello World!"

@app.route('/py', methods=['GET', 'POST'])
def main():
    """ Gateway """
    content = request.get_json()
    function_to_invoke = {
    	'survival_ll_kaplan_meier': survival_ll_kaplan_meier,
    	'cluster_sp_agglomerative': cluster_sp_agglomerative,	
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
        'cluster_sk_agglomerative': cluster_sk_agglomerative,
        'cluster_sk_spectral': cluster_sk_spectral,
        'manifold_sk_lineardiscriminantanalysis': manifold_sk_lineardiscriminantanalysis,
        'manifold_sk_quadradicdiscriminantanalysis': manifold_sk_quadradicdiscriminantanalysis,
        'cluster_sk_mini_batch_dictionary_learning': cluster_sk_mini_batch_dictionary_learning,
        'cluster_sk_mini_batch_sparse_pca': cluster_sk_mini_batch_sparse_pca,
    }.get(content['method'], echo)
    return function_to_invoke(content)

# if __name__ == '__main__':
#     app.run()
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)
