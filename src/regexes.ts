// Any important, complex, or frequently used regex goes in here

// ================================ Regexes ================================ //

export default {
	optionParse: /(?<=\s|^)(--\w[\w\-.]*|-\w{1,2})(?:[= ]+([^-\s]+|"[^"]+"))?(?=\s|$)/gm,
	optionValidate: /^--(\w[\w\-.]+)$/,
	aliasValidate: /^-(\w{1,2})$/,
	argumentParse: /^((?:<\w+> ?)*)((?:\[\w+(?:\.{3})?\])|(?:<\w+(?:\.{3})?>))?$/,
	commandValidate: /^[\w-]*$/,
};
