// Any important, complex, or frequently used regex goes in here

// ================= Regexes ================= //

const regexes = {
    optionParse: /(?<=\s|^)(--?\w[\w-]*)(?:[= ]?)(?:(\w*)|"([^"]*)")?(?<! )/gm,
    optionValidate: /^--(\w*)$/,
    aliasValidate: /^-(\w)$/,
    argParse: /^((?:<\w*> ?)*)(\[\w*(?:\.\.\.)?\])?$/gm,
    argValidate: /^(?:<\w*> ?)*(?:\[\w*(?:\.\.\.)?\])?$/gm
};

// ================= Export ================= //

export default regexes;
