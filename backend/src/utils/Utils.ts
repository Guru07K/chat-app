export class Utils {

    public static isNull<T>(value: T | null | undefined): value is null | undefined {
        return value === null || value === undefined;
    }

    public static isNullOrEmptyArray<T>(value: T[] | null | undefined): boolean {
        return this.isNull(value) || value.length === 0;
    }

}