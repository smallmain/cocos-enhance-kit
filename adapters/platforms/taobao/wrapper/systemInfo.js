const adapter = window.__globalAdapter;
let adaptSysFunc = adapter.adaptSys;

//taobao IDE language   ("Chinese")
//taobao phone language (Andrond: "cn", iPad: 'zh_CN')
const languageMap = {
    Ch: "zh",
    cn: "zh",
    zh: "zh",
};

Object.assign(adapter, {
    // Extend adaptSys interface
    adaptSys (sys) {
        adaptSysFunc.call(this, sys);
        sys.platform = sys.TAOBAO;
        sys.language = languageMap[sys.language] || sys.language;
    },
});