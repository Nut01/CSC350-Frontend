import axios from 'axios';

const baseUrl = "https://rich-rose-lizard-suit.cyclic.app";

const useAxios = axios.create({
    baseURL: baseUrl,
});

export default useAxios;