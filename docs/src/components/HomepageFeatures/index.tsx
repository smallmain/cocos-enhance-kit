import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: '性能提升',
    description: (
      <>
        众多特性让你无需任何改动即可让项目的性能得到提升，并且能通过手动优化达到更好的效果。
      </>
    ),
  },
  {
    title: '完全开源',
    description: (
      <>
        服务包是完全开源的项目，包括对原生引擎、JavaScript 引擎的改动都附有详细的原理文档。
      </>
    ),
  },
  {
    title: '原生体验',
    description: (
      <>
        所有特性都通过自定义引擎实现，这种深度整合能带来其他方式所没有的 “原生” 的使用体验。
      </>
    ),
  },
  {
    title: '增强特性',
    description: (
      <>
        文本高 DPI 渲染、Spine 换装等实用特性的加入，让你的游戏开发更加省时省力省心。
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--3')}>
      {/* <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div> */}
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
