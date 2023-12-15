import React from 'react';
import {
  SmoothStepEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getSmoothStepPath,
  MarkerType
} from 'reactflow';
import { Flex } from '@chakra-ui/react';
import MyIcon from '@/components/Icon';

const ButtonEdge = (
  props: EdgeProps<{
    onDelete: (id: string) => void;
  }>
) => {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
    selected,
    style = {}
  } = props;

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition
  });

  const edgeStyle = {
    ...style,
    ...(selected
      ? {
          strokeWidth: 4,
          stroke: '#3370ff'
        }
      : { strokeWidth: 2, stroke: '#BDC1C5' })
  };

  return (
    <>
      <SmoothStepEdge {...props} style={edgeStyle} />
      <EdgeLabelRenderer>
        <Flex
          alignItems={'center'}
          justifyContent={'center'}
          position={'absolute'}
          transform={`translate(-50%, -50%) translate(${labelX}px,${labelY}px)`}
          pointerEvents={'all'}
          w={'20px'}
          h={'20px'}
          bg={'white'}
          borderRadius={'20px'}
          color={'black'}
          cursor={'pointer'}
          border={'1px solid #fff'}
          _hover={{
            boxShadow: '0 0 6px 2px rgba(0, 0, 0, 0.08)'
          }}
          onClick={() => data?.onDelete(id)}
        >
          <MyIcon
            name="closeSolid"
            w={'100%'}
            color={selected ? 'myBlue.800' : 'myGray.500'}
          ></MyIcon>
        </Flex>
      </EdgeLabelRenderer>
    </>
  );
};

export default React.memo(ButtonEdge);
