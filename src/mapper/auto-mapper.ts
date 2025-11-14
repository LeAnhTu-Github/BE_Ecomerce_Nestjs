import { ClassConstructor } from "class-transformer";

class AutoMapper {
  // FIXME:  need to fix types
  static mapPlainToInstance<T extends {}, U extends {}>(
    source: T,
    destination: ClassConstructor<U>,
  ): U {
    const sourceObject = source as Record<string, unknown>;
    const destinationObject = new destination();
    const commonKeys = Object.keys(sourceObject).filter((key) =>
      Object.keys(destinationObject).includes(key),
    );
    const mappedObject: Partial<U> = {};

    commonKeys.forEach((key) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      mappedObject[key] = sourceObject[key];
    });
    // console.log(
    //   mappedObject,
    //   commonKeys,
    //   source,
    //   destinationObject,
    //   destination,
    // );

    return mappedObject as U;
  }
}

export { AutoMapper };
