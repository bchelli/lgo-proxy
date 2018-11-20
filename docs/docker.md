# Run proxy with docker

You need a proxy package to run it with docker.

## Build the image

```
docker build . -t lgo-proxy
```

## Initialize the proxy

You can skip this step if you already have a token on the host.

Note the pin, you will reuse it to start the server in the next step.

Adapt the env variables below and run:

```
docker run \
  --rm \
  -v <tokens_location>:/var/lib/softhsm/tokens \
  -e LGO_SIGNER_PIN=<your_pin> \
  lgo-proxy \
  node lib/scripts/initializeHsm
```

Replace `tokens_location` with a host directory.
The token used by the proxy will be stored in that location.
It may be useful to backup those data if you want to keep the same acess key and public key.

## Start the proxy server

Adapt the env variables below and run:

```
docker run \
  -d \
  -v <tokens_location>:/var/lib/softhsm/tokens \
  -e LGO_SIGNER_PIN=<your_pin> \
  -e LGO_ACCESS_KEY=<your_access_token> \
  --restart=on-failure \
  --name lgo-proxy \
  -p 3002:3002 \
  lgo-proxy
```

You may use or not the provided restart policy in example.
See [docker documentation](https://docs.docker.com/engine/reference/run/#restart-policies---restart) for more details.
