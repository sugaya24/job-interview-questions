import {
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';
import { BiDotsHorizontalRounded, BiEditAlt, BiTrash } from 'react-icons/bi';

export const EditMenu = () => {
  return (
    <Menu>
      <MenuButton as={'button'}>
        <IconButton
          variant={'none'}
          icon={<BiDotsHorizontalRounded />}
          aria-label={'edit'}
        />
      </MenuButton>
      <MenuList color={'MenuText'}>
        <MenuItem>
          <HStack>
            <BiEditAlt />
            <Text>Edit</Text>
          </HStack>
        </MenuItem>
        <MenuItem color={'red.600'} fontWeight={'bold'}>
          <HStack>
            <BiTrash />
            <Text>DELETE</Text>
          </HStack>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default EditMenu;
