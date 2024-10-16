const adapter = window.__globalAdapter;
let adaptSysFunc = adapter.adaptSys;

Object.assign(adapter, {
    // Extend adaptSys interface
    adaptSys (sys) {
        adaptSysFunc.call(this, sys);
        sys.platform = sys.XIAOMI_GAME;
    },
});