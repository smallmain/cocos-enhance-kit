import clsx from 'clsx';
import React from 'react';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: '增强特性',
    description: (
      <>
        新增文本高 DPI 渲染、Spine 换装等实用特性，让你的游戏开发更加省时省力省心。
      </>
    ),
  },
  {
    title: '性能提升',
    description: (
      <>
        多纹理渲染、动态合图、Label 增强等众多优化让你的游戏性能得到成倍的提升！
      </>
    ),
  },
  {
    title: '开箱即用',
    description: (
      <>
        本项目代码完全开源，包括对原生引擎、JavaScript 引擎的改动都附有详细的使用文档。
      </>
    ),
  },
  {
    title: '原生体验',
    description: (
      <>
        所有特性都通过自定义引擎实现，这种深度整合能带来前所未有的 “原生” 使用体验。
      </>
    ),
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
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
