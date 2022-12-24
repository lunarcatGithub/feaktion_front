import { useEffect, useState } from "react";

export function useDateTimeConvert(currentDate?: Date | string, type?: string) {
  const [getDate, setGetDate] = useState<string | null>();
  // const [countryDivided, setCurrentTime] = useState();
  if (!currentDate) return [null];

  const today = new Date();
  // UTC 시간 계산
  const utc = today.getTime() + today.getTimezoneOffset() * 60 * 1000;

  // UTC to KST (UTC + 9시간)
  const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
  const kr_curr = new Date(utc + KR_TIME_DIFF);

  const DateTime = new Date(currentDate);
  let month: string | number = DateTime.getMonth() + 1;
  let day: string | number = DateTime.getDate();

  const betweenTime = Math.floor(
    (kr_curr.getTime() - DateTime.getTime()) / 1000 / 60
  );
  const betweenTimeHour = Math.floor(betweenTime / 60);
  const betweenTimeDay = Math.floor(betweenTimeHour / 24);
  const betweenTimeWeek = Math.floor(betweenTimeDay / 7);
  const betweenTimeMonth = Math.floor(betweenTimeWeek / 4);

  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }
  const year = DateTime.getFullYear();

  const timeHandler = (): void => {
    if (type === "JustDate") {
      setGetDate(`${year}.${month}.${day}`);
    } else {
      if (betweenTime < 1) {
        setGetDate("방금 전");
      } else if (betweenTime < 60) {
        setGetDate(`${betweenTime}분 전`);
      } else if (betweenTimeHour < 24) {
        setGetDate(`${betweenTimeHour}시간 전`);
      } else if (betweenTimeDay < 7) {
        setGetDate(`${betweenTimeDay}일 전`);
      } else if (betweenTimeWeek < 4) {
        setGetDate(`${betweenTimeWeek}주 전`);
      } else if (betweenTimeMonth < 12) {
        setGetDate(`${betweenTimeMonth}개월 전`);
      } else {
        setGetDate(year ? `${year}.${month}.${day}` : "");
      }
    }
  };

  useEffect(() => {
    timeHandler();
  }, [currentDate, type]);

  return [currentDate ? getDate : null];
}
