import { Box } from '@/components/ui/box';
import { Fab, FabIcon, FabLabel } from '@/components/ui/fab';
import { AddIcon } from '@/components/ui/icon';
import {DrawerLayout} from "@/components/drawer/DrawerLayout";
import { Drawer } from '../ui/drawer';

export function FabDrawer() {
  return (
    
      <Fab
        size="md"
        placement="top right"
        isHovered={false}
        isDisabled={false}
        isPressed={false}
        className="bg-fc-neutral rounded-xl rounded-br-none rounded-tr-none shadow-2xl "
      >
        <DrawerLayout />
        
      </Fab>
    
  );
}
