import { Area, MediaSize, Point, Size } from './types';
/**
 * Compute the dimension of the crop area based on media size,
 * aspect ratio and optionally rotation
 */
export declare function getCropSize(mediaWidth: number, mediaHeight: number, containerWidth: number, containerHeight: number, aspect: number, rotation?: number): Size;
/**
 * Ensure a new media position stays in the crop area.
 */
export declare function restrictPosition(position: Point, mediaSize: Size, cropSize: Size, zoom: number, rotation?: number): Point;
export declare function getDistanceBetweenPoints(pointA: Point, pointB: Point): number;
export declare function getRotationBetweenPoints(pointA: Point, pointB: Point): number;
/**
 * Compute the output cropped area of the media in percentages and pixels.
 * x/y are the top-left coordinates on the src media
 */
export declare function computeCroppedArea(crop: Point, mediaSize: MediaSize, cropSize: Size, aspect: number, zoom: number, rotation?: number, restrictPosition?: boolean): {
    croppedAreaPercentages: Area;
    croppedAreaPixels: Area;
};
/**
 * Compute the crop and zoom from the croppedAreaPixels
 */
export declare function getInitialCropFromCroppedAreaPixels(croppedAreaPixels: Area, mediaSize: MediaSize, cropSize?: Size): {
    crop: Point;
    zoom: number;
};
/**
 * Return the point that is the center of point a and b
 */
export declare function getCenter(a: Point, b: Point): Point;
/**
 *
 * Returns an x,y point once rotated around xMid,yMid
 */
export declare function rotateAroundMidPoint(x: number, y: number, xMid: number, yMid: number, degrees: number): [number, number];
/**
 * Returns the new bounding area of a rotated rectangle.
 */
export declare function translateSize(width: number, height: number, rotation: number): Size;
/**
 * Combine multiple class names into a single string.
 */
export declare function classNames(...args: (boolean | string | number | undefined | void | null)[]): string;
//# sourceMappingURL=helpers.d.ts.map