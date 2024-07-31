Exploratory functions for multi-tenant OpenFaaS clusters
========================================================

This repository contains functions designed to explore the security posture of multi-tenant OpenFaaS clusters. The functions are designed to be deployed to an OpenFaaS cluster and run as a function. The functions are designed to be run by a user with the appropriate permissions to deploy functions to the cluster.

* [core-services](core-services/) - This function written in Node.js checks connectivity to various OpenFaaS core services from the function namespace.
* [nats-sidechannel](nats-sidechannel/) - This function written in Python checks for the presence of a side-channel attack by publishing messages directly to the default shared queue in OpenFaaS, simulating an async message being published to the queue by the OpenFaaS gateway.

## Basic guidelines on multi-tenancy

The following guidelines are recommended for multi-tenant OpenFaaS clusters:

* Segregate tenants into namespaces
* Use network policies to restrict traffic between namespaces, so that:
    * tenant namespaces cannot communicate with each other,
    * and no tenant namespace can communicate with the OpenFaaS core services
* Set limit ranges for each tenant namespace
* Set resource quotas for each function when deployed via API for RAM/CPU. Limit RAM, and set a request for CPU
* Ensure the functions run as non-root, and that the appropriate settings are configured in the helm chart to prevent users from overriding this or from calling `setuid`
* Ensure that the OpenFaaS API has basic authentication or IAM-based authentication enabled, so that user code cannot be used to access the API

