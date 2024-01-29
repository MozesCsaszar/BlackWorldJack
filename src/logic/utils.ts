/*                                      Util Namespaces */

namespace MathUtil {
  export function getRandomIntBelow(max: number): number {
    return Math.floor(Math.random() * max);
  }
}
namespace StringUtil {
  export function padRightUntilLength(
    str: string,
    length: number,
    char: string
  ): string {
    while (str.length < length) {
      str = char + str;
    }
    return str;
  }
}
