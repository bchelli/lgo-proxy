FROM node:carbon

ENV SOFT_HSM_VERSION=2.5.0

RUN cd /usr/src && \
    wget https://dist.opendnssec.org/source/softhsm-${SOFT_HSM_VERSION}.tar.gz && \
    tar -xzf softhsm-${SOFT_HSM_VERSION}.tar.gz && \
    cd softhsm-${SOFT_HSM_VERSION} && \
    ./configure --disable-gost && \
    make && \
    make install && \
    rm -rf softhsm-${SOFT_HSM_VERSION}.tar.gz softhsm-${SOFT_HSM_VERSION}

WORKDIR /usr/src/app

COPY . .

RUN npm install --production

ENV LGO_SIGNER_LIBRARY_PATH=/usr/local/lib/softhsm/libsofthsm2.so

CMD [ "bash", "-c", "./start.sh" ]
