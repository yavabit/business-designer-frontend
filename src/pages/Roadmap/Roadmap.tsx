import { ItemsPageLayout } from '@app/layouts/ItemsPageLayout/ItemsPageLayout';
import { SnakeLine } from './SnakeLine/SnakeLine';
import { roadmapItems } from '../../shared/data/roadmap';

export const Roadmap = () => {
  
  return (
    <ItemsPageLayout title="Роадмап">
      <SnakeLine items={roadmapItems} rowHeight={140} rowWidth={900}/>
    </ItemsPageLayout>
  );
};
