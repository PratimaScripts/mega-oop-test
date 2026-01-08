import React from "react";
import { Table, Tag } from "antd";
import { withRouter } from "react-router-dom";

class Invitations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  imPersonateUser = async data => {
    this.props.impersonateUserMain(data);
    // this.props.history.push("/impersonate/landlord");
  };

  render() {
    const columns = [
      {
        title: "Name",
        key: "name",
        render: text => (
          <p>
            {text.firstName} {text.lastName}
          </p>
        )
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email"
      },
      {
        title: "Invited Role",
        dataIndex: "invite.role",

        key: "invitedRole",
        render: tag => (
          <Tag color={"geekblue"} key={"invitedRole"}>
            {tag.toUpperCase()}
          </Tag>
        )
      },
      {
        title: "Action",
        key: "action",
        render: (text, record) => (
          <span>
            <button onClick={() => this.imPersonateUser(record)}>
              Impersonate
            </button>
          </span>
        )
      }
    ];

    return (
      <Table columns={columns} dataSource={this.props.userData.invitedOn} />
    );
  }
}

export default withRouter(Invitations);
