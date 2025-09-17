import { NodesCategoryEnum } from "@type/nodes";

export const nodesCategoriesNames = {
    [NodesCategoryEnum.Business_process]: 'Бизнес процесс',
    [NodesCategoryEnum.Agent]: 'Агент'
} as const satisfies Record<NodesCategoryEnum, string>;

export const nodesCategoriesColor = {
    [NodesCategoryEnum.Business_process]: '#1668dc',
    [NodesCategoryEnum.Agent]: 'orange'
} as const satisfies Record<NodesCategoryEnum, string>;