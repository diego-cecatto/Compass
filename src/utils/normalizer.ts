export class Normalizer {
    static capitalizeWordsAndRemoveHyphen(str: string) {
        const words = str.split('-');
        const capitalizedWords = words.map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1)
        );
        return capitalizedWords.join('');
    }

    static capitalizePackageName(packageName: string, joiner: string = '') {
        let cleanedName = packageName.replace(/^@[\w-]+\//, '');
        let words = cleanedName.split('.');
        cleanedName = words[words.length - 1];
        words = cleanedName.split('-');
        const capitalizedWords = words.map((word) => {
            if (word === 'use') {
                return word;
            }
            return word.charAt(0).toUpperCase() + word.slice(1);
        });
        const capitalizedPackageName = capitalizedWords.join(joiner);
        return capitalizedPackageName;
    }
}
