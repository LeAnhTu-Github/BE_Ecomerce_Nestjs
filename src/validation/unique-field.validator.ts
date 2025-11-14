import { Injectable } from "@nestjs/common";
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { PrismaService } from "../service/prisma.service";

/**
 * @example
 @Validate(UniqueFieldValidator, ["name", "store"])
  * name: string
 */
@ValidatorConstraint({ name: "UniqueField", async: true })
@Injectable()
export class UniqueFieldValidator implements ValidatorConstraintInterface {
  async validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    const [field, model] = validationArguments?.constraints as string[];
    console.log(field, model);
    const prismaService = new PrismaService();
    // @ts-ignore
    const existEntity = await prismaService[model].findUnique({
      where: { [field]: value },
    });

    return !existEntity;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    const [field, model] = validationArguments?.constraints as string[];
    return `${model.toUpperCase()} with ${field.toUpperCase()} ${validationArguments?.value} already exist`;
  }
}
