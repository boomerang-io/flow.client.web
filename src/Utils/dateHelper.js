import moment from "moment";

export default class DateHelper {
  // See tests for desired format.
  static getFormattedDateTime(date = new Date()) {
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${this.padLeadingZero(
      date.getMinutes()
    )}:${this.padLeadingZero(date.getSeconds())}`;
  }

  static padLeadingZero(value) {
    return value > 9 ? value : `0${value}`;
  }

  static convertUnixSecondsToDate(timestamp) {
    if (timestamp.length === 10) {
      timestamp = timestamp * 1000;
    }

    const date = new Date(timestamp.timestamp * 1000);
    const day = date.getUTCDate(); //returns day of month UTC
    const month = date.getUTCMonth();
    const year = date.getUTCFullYear();
    return `${year}-${month}-${day}`;
  }

  //slightly modified from http://stackoverflow.com/a/23259289 w/ renaming and es6 syntax

  static timeMillisecondsToTimeUnit(seconds) {
    const hoursCount = Math.floor(seconds / 3600000);
    const singularHour = hoursCount === 1 ? `1 hr` : "";

    const minutesCount = Math.floor((seconds % 3600000) / 60000);
    const singularMinute = minutesCount === 1 ? `1 min` : "";

    const secondsCount = Math.floor(((seconds % 3600000) % 60000) / 1000);
    const singularSecond = secondsCount === 1 ? `1 sec` : "";

    const milliSecondsCount = Math.floor(seconds % 1000);
    const singularMilisecond = milliSecondsCount === 1 ? `1 ms` : "";

    const hoursText = hoursCount > 1 ? `${hoursCount} hrs` : singularHour;
    const minutesText = minutesCount > 1 ? `${minutesCount} mins` : singularMinute;
    const secondsText = secondsCount > 1 ? `${secondsCount} secs` : singularSecond;
    const millisecondsText = milliSecondsCount > 1 ? `${milliSecondsCount} ms` : singularMilisecond;

    if (!hoursCount && !minutesCount && !secondsCount && millisecondsText) {
      return millisecondsText;
    }
    const message = `${hoursText} ${minutesText} ${secondsText}`;
    return message.trim();
  }

  static timeMinutesToTimeUnit(minutes) {
    const hoursCount = Math.floor(minutes / 60);
    const singularHour = hoursCount === 1 ? `1 hr` : "";

    const minutesCount = Math.floor(minutes % 60);
    const singularMinute = minutesCount === 1 ? `1 min` : "";

    const hoursText = hoursCount > 1 ? `${hoursCount} hrs` : singularHour;
    const minutesText = minutesCount > 1 ? `${minutesCount} mins` : singularMinute;

    return `${hoursText} ${minutesText}`;
  }

  static timeAgo(datetimestamp, duration) {
    return moment(datetimestamp).add(duration, "milliseconds").fromNow();
  }

  /**
   * Get human readdable difference from a time in the past to now
   * @param {String} datetimestamp
   * @returns {String}
   */
  static durationFromThenToNow(datetimestamp) {
    const diffMilli = Date.now() - Date.parse(datetimestamp);
    return this.timeMillisecondsToTimeUnit(diffMilli);
  }

  static determineUpdatedMessage(minutesAgo) {
    return minutesAgo === 0 ? "just now" : `${this.timeMinutesToTimeUnit(minutesAgo)} ago`;
  }
}
