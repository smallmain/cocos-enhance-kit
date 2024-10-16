const adapter = window.__globalAdapter;

Object.assign(adapter, {
    adaptSys: require('./BaseSystemInfo'),

    adaptView: require('./View'),

    adaptContainerStrategy: require('./ContainerStrategy'),
});