// SetMetaData is a decorator used to attach custom metadata to route handlers, classes, or methods. 
// This metadata can then be accessed and utilized by other parts of your application, such as Guards, Interceptors, or Pipes, to implement custom logic.
import { SetMetadata } from "@nestjs/common/decorators/core/set-metadata.decorator";

export const Public = () => SetMetadata("isPublic", true);