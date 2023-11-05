export const useExample = () => {
    return function showMessage(message: string = 'use example hook') {
        console.log(message);
    };
};
