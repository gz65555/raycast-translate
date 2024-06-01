import { debounce } from "lodash-es";
import { useEffect, useState } from "react";
import fetch from "node-fetch";

type ResponseData = {
  // error?: string;
  result: { msg: string; code: number };
  data: {
    entries: SimpleWord[];
    query: string;
  };
};

type SimpleWord = {
  explain: string;
  entry: string;
};

export function requestSuggest(word: string): Promise<ResponseData> {
  // @ts-ignore
  return fetch(`http://dict.youdao.com/suggest?q=${word}&le=eng&num=9&ver=2.0&doctype=json`).then((res) => res.json());
}

const searchWord = debounce(
  (word: string, onSearchDone: Function) => {
    requestSuggest(word).then((result) => onSearchDone(result));
  },
  300,
  { leading: false, trailing: true },
);

const debounceSearchWord = (word: string): Promise<ResponseData> => {
  return new Promise<ResponseData>((resolve) => {
    searchWord(word, resolve);
  });
};

export function useSearchWord(word: string): { isLoading: boolean; result: SimpleWord[] | undefined } {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<SimpleWord[]>();
  async function fetchData(word: string) {
    setIsLoading(true);
    const result = await debounceSearchWord(word);
    setResult(result.data.entries);
    setIsLoading(false);
  }

  useEffect(() => {
    if (word.trim().length > 0) fetchData(word);
  }, [word]);

  return { isLoading, result };
}
