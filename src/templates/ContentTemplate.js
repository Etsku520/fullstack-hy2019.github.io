import './ContentTemplate.scss';

import path from 'path';

import { graphql } from 'gatsby';
import Parser from 'html-react-parser';
import domToReact from 'html-react-parser/lib/dom-to-react';
import React from 'react';
import Highlight from 'react-highlight';

import colors from '../colors';
import Arrow from '../components/Arrow/Arrow';
import { Banner } from '../components/Banner/Banner';
import Footer from '../components/Footer/Footer';
import Layout from '../components/layout';
import PrevNext from '../components/PrevNext/PrevNext';
import ReturnInfo from '../components/ReturnInfo/ReturnInfo';
import ScrollNavigation from '../components/ScrollNavigation/ScrollNavigation';
import { SubHeader } from '../components/SubHeader/SubHeader';

export default function ContentTemplate({ data }) {
  const { markdownRemark } = data;
  const { frontmatter, html } = markdownRemark;
  const { mainImage, title, subTitle, letter, part, partColor } = frontmatter;

  const colorCode = colors[partColor];

  const parserOptions = {
    replace: ({ type, name, attribs, children }) => {
      if (type === 'tag' && name === 'picture') {
        return (
          <picture>
            <img
              style={{ borderColor: colorCode }}
              alt="asd"
              src={children[0].attribs.src}
            />
          </picture>
        );
      } else if (
        type === 'tag' &&
        name === 'pre' &&
        children[0].attribs &&
        children[0].attribs.class === 'language-js'
      ) {
        return (
          <Highlight className="javascript" innerHTML={true}>
            {domToReact(children[0], parserOptions)}
          </Highlight>
        );
      } else if (type === 'tag' && attribs.class === 'content') {
        return (
          <div className="container">
            <ScrollNavigation className="col-3" />

            <div className="course-content col-7">
              {domToReact(children, parserOptions)}
            </div>
          </div>
        );
      } else if (type === 'tag' && attribs.class === 'tasks') {
        return (
          <Banner
            style={{
              backgroundColor: colorCode,
            }}
            className="spacing spacing--after"
          >
            <div className="container">
              <div className="course-content col-7 push-right-3">
                {domToReact(children, parserOptions)}
              </div>
            </div>
          </Banner>
        );
      }
      return;
    },
  };

  return (
    <Layout>
      <div className="spacing--small spacing--after">
        <div className="course-container">
          <Banner
            backgroundColor={colorCode}
            className="spacing--after"
            style={{
              backgroundImage: `url(${path.resolve(mainImage.publicURL)})`,
              backgroundPosition: 'center center',
              backgroundSize: '80%',
              backgroundRepeat: 'no-repeat',
              backgroundColor: colorCode,
            }}
          >
            <div className="container">
              <Arrow
                upperCase
                content={[
                  {
                    backgroundColor: colorCode,
                    text: 'Yleistä',
                    link: '/about',
                  },
                  {
                    backgroundColor: colorCode,
                    text: title,
                    link: `/osa${part}`,
                  },
                  {
                    backgroundColor: 'black',
                    text: subTitle,
                  },
                ]}
              />
            </div>
          </Banner>
          <div className="course">
            <div className="container">
              <div
                className="col-7 course-content push-right-3"
                style={{ borderColor: colorCode }}
              >
                <p className="col-1 letter" style={{ borderColor: colorCode }}>
                  {letter}
                </p>
                <SubHeader headingLevel="h1" text={subTitle} />
              </div>
            </div>
            {Parser(html, parserOptions)}
          </div>

          <ReturnInfo />

          <PrevNext
            prev={part !== 0 ? part - 1 : undefined}
            next={part !== 7 ? part + 1 : undefined}
          />
        </div>
      </div>

      <Footer />
    </Layout>
  );
}

export const contentPageQuery = graphql`
  query($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        title
        subTitle
        path
        mainImage {
          publicURL
        }
        partColor
        part
        letter
      }
    }
  }
`;