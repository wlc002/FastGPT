import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import RemarkGfm from 'remark-gfm';
import RemarkMath from 'remark-math';
import RehypeKatex from 'rehype-katex';
import RemarkBreaks from 'remark-breaks';

import 'katex/dist/katex.min.css';
import styles from './index.module.scss';
import dynamic from 'next/dynamic';

import { Link, Button } from '@chakra-ui/react';
import MyTooltip from '../MyTooltip';
import { useTranslation } from 'next-i18next';
import { EventNameEnum, eventBus } from '@/web/common/utils/eventbus';
import MyIcon from '../Icon';
import { getFileAndOpen } from '@/web/core/dataset/utils';
import { MARKDOWN_QUOTE_SIGN } from '@fastgpt/global/core/chat/constants';

const CodeLight = dynamic(() => import('./CodeLight'));
const MermaidCodeBlock = dynamic(() => import('./img/MermaidCodeBlock'));
const MdImage = dynamic(() => import('./img/Image'));
const EChartsCodeBlock = dynamic(() => import('./img/EChartsCodeBlock'));

const ChatGuide = dynamic(() => import('./chat/Guide'));
const QuestionGuide = dynamic(() => import('./chat/QuestionGuide'));
const ImageBlock = dynamic(() => import('./chat/Image'));

export enum CodeClassName {
  guide = 'guide',
  questionGuide = 'questionGuide',
  mermaid = 'mermaid',
  echarts = 'echarts',
  quote = 'quote',
  img = 'img'
}

function Code({ inline, className, children }: any) {
  const match = /language-(\w+)/.exec(className || '');
  const codeType = match?.[1];

  if (codeType === CodeClassName.mermaid) {
    return <MermaidCodeBlock code={String(children)} />;
  }

  if (codeType === CodeClassName.guide) {
    return <ChatGuide text={String(children)} />;
  }
  if (codeType === CodeClassName.questionGuide) {
    return <QuestionGuide text={String(children)} />;
  }
  if (codeType === CodeClassName.echarts) {
    return <EChartsCodeBlock code={String(children)} />;
  }
  if (codeType === CodeClassName.img) {
    return <ImageBlock images={String(children)} />;
  }
  return (
    <CodeLight className={className} inline={inline} match={match}>
      {children}
    </CodeLight>
  );
}
function Image({ src }: { src?: string }) {
  return <MdImage src={src} />;
}
function A({ children, ...props }: any) {
  const { t } = useTranslation();

  // empty href link
  if (!props.href && typeof children?.[0] === 'string') {
    const text = useMemo(() => String(children), [children]);

    return (
      <MyTooltip label={t('core.chat.markdown.Quick Question')}>
        <Button
          variant={'base'}
          size={'xs'}
          borderRadius={'md'}
          my={1}
          onClick={() => eventBus.emit(EventNameEnum.sendQuestion, { text })}
        >
          {text}
        </Button>
      </MyTooltip>
    );
  }

  // quote link
  if (children?.length === 1 && typeof children?.[0] === 'string') {
    const text = String(children);
    if (text === MARKDOWN_QUOTE_SIGN && props.href) {
      return (
        <MyTooltip label={props.href}>
          <MyIcon
            name={'core/chat/quoteSign'}
            transform={'translateY(-2px)'}
            w={'18px'}
            color={'myBlue.600'}
            cursor={'pointer'}
            _hover={{
              color: 'myBlue.800'
            }}
            onClick={() => getFileAndOpen(props.href)}
          />
        </MyTooltip>
      );
    }
  }

  return <Link {...props}>{children}</Link>;
}

const Markdown = ({ source, isChatting = false }: { source: string; isChatting?: boolean }) => {
  const components = useMemo(
    () => ({
      img: Image,
      pre: 'div',
      p: 'div',
      code: Code,
      a: A
    }),
    []
  );

  const formatSource = source
    .replace(/\\n/g, '\n&nbsp;')
    .replace(/(http[s]?:\/\/[^\s，。]+)([。，])/g, '$1 $2')
    .replace(/\n*(\[QUOTE SIGN\]\(.*\))/g, '$1');

  return (
    <ReactMarkdown
      className={`markdown ${styles.markdown}
      ${isChatting ? (source === '' ? styles.waitingAnimation : styles.animation) : ''}
    `}
      remarkPlugins={[RemarkGfm, RemarkMath, RemarkBreaks]}
      rehypePlugins={[RehypeKatex]}
      // @ts-ignore
      components={components}
      linkTarget={'_blank'}
    >
      {formatSource}
    </ReactMarkdown>
  );
};

export default React.memo(Markdown);
