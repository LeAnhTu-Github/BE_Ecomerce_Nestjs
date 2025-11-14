import {
  getMetadataStorage,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from "class-validator";

export const IsFile = (
  property: string,
  validationOptions?: ValidationOptions,
) => {
  return (object: Record<string, any>, propertyName: string) => {
    registerDecorator({
      name: "isFile",
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: `${property} is not a valid file`,
        ...validationOptions,
      },
      validator: {
        validate(value: any, args: ValidationArguments) {
          const isOptional = getMetadataStorage()
            .getTargetValidationMetadatas(
              object.constructor,
              propertyName,
              false,
              false,
            )
            .some((metadata) => metadata.type === "conditionalValidation");

          if (isOptional && !value) return true;

          return (
            value &&
            value.mimetype &&
            value.mimetype.match(
              /\/(jpg|jpeg|png|webp|gif|pdf|doc|docx|xls|xlsx|ppt|pptx|txt|csv|mp4|mp3|avi|mkv|zip|rar|7z|tar|gz|gzip|tgz|psd|ai|xd|sketch|figma|eps|ttf|otf|woff|woff2|eot|svg)$/,
            )
          );
        },
      },
    });
  };
};

export function IsNotEqualTo(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return (object: Record<string, any>, propertyName: string) => {
    registerDecorator({
      name: "isNotEqualTo",
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: `${propertyName} should not be equal to ${property}`,
        ...validationOptions,
      },
      validator: {
        validate(value: any, args: ValidationArguments) {
          const relatedValue = (args.object as any)[property];
          if (typeof relatedValue === "undefined") return true;
          return value !== relatedValue;
        },
      },
    });
  };
}
