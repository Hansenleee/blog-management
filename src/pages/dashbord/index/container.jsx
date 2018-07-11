import React from 'react';

export default class DashBord extends React.Component {
  render() {
    return (
      <div className="dashbord">
        <h1>HELLO</h1>
        <style jsx>{`
          @import 'src/assets/style/common/variables.styl';

          .dashbord {
            height: 100%;
            background: $white;
            overflow: hidden;
          }
          h1 {
            margin-top: 100px;
            text-align: center;
          }
        `}</style>
      </div>
    );
  }
}