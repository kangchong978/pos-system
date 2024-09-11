export default function getFirstCharacters(str: string) {
    return str.split(' ')
        .map(word => word.charAt(0)) // Get the first character of each word
        .join(''); // Join them into a single string
}
