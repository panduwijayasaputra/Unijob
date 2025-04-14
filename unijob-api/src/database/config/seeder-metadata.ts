import 'reflect-metadata';

interface SeederMetadata {
    seeds: string[]; // Entities this seeder handles
    dependencies: string[]; // Entities this seeder depends on
}

export function SeederInfo(metadata: SeederMetadata): ClassDecorator {
    return (target: any) => {
        Reflect.defineMetadata('seeder:info', metadata, target);
    };
}

export function getSeederInfo(target: any): SeederMetadata {
    return Reflect.getMetadata('seeder:info', target);
}
