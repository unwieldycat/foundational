// Any important, complex, or frequently used regex goes in here

// ================= Regexes ================= //

export default {
    optionParse: /(?<=\s|^)(--\w[\w-]*|-\w)(?:[= ]+(\w+|"[^"]+"))?(?<! )/gm,
    optionValidate: /^--(\w+)$/,
    aliasValidate: /^-(\w)$/,
    argumentParse: /^((?:<\w*> ?)+)(\[\w*(?:\.\.\.)?\])?$/m
};
