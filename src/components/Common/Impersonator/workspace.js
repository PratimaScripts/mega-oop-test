import { Avatar, Button, Divider, List, message,   Skeleton, Typography } from 'antd';
import UserRoleQuery from 'config/queries/userRole';
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
// import _map from 'lodash/map';
import NProgress from 'nprogress';
import React, { useContext, useState } from 'react';
import { useLazyQuery, useQuery } from 'react-apollo';
import { useHistory } from 'react-router';
import { UserDataContext } from 'store/contexts/UserContext';
import { saveTokenInCookie } from "utils/cookie";

const Workspace = () => {
  const [workspace, setWorkspace] = useState([]);
  const [loggedUserInfo, setLoggedUserInfo] = useState(null);
  const { dispatch } = useContext(UserDataContext);
  const defaultPageSize = 5;
  const [pageConfig, setPageConfig] = useState({ page: 1, pageSize: defaultPageSize })
  const history = useHistory()

  const { refetch } = useQuery(UserRoleQuery.getUserWorkspace, {
    onCompleted: ({ userWorkspace }) => {
      if (userWorkspace.success) {
        setWorkspace(userWorkspace.data.workspace)
        setLoggedUserInfo(userWorkspace.data.loggedUser)
        NProgress.done();
      }
    }
  })

  const [impersonateQuery] = useLazyQuery(UserRoleQuery.impersonateUser, {
    onCompleted: ({ impersonateUser }) => {
      if (!_isEmpty(impersonateUser) && _get(impersonateUser, "success", false)) {
        localStorage.setItem("userId", impersonateUser.data._id)
        saveTokenInCookie(_get(impersonateUser, "token", ""))
        localStorage.removeItem("isLoggedOut");
        NProgress.done();
        dispatch({ type: "SET_USER_DATA", payload: impersonateUser })
        history.push(`/${impersonateUser.data.role}`)
      }
    }
  })
  const [acceptInvitation] = useLazyQuery(UserRoleQuery.acceptInvitation, {
    onCompleted: ({ acceptInvitation }) => {
      NProgress.done();
      message.success("Invitation Accepted!");
      refetch();
      NProgress.start();
    }
  })

  const onImpersonateLogin = async formDataLogin => {
    NProgress.start();
    if (formDataLogin?.inviteToken) {
      acceptInvitation({ variables: { token: formDataLogin.inviteToken } });
    } else {
      impersonateQuery({ variables: { inviteId: formDataLogin?._id } });
    }
  };
  const accessTypes = [
    { name: 'Accountant', value: 'ACCOUNTANT' },
    { name: 'Portfolio Manager', value: 'PORTFOLIO_MANAGER' },
    { name: 'Support', value: 'SUPPORT' },
    { name: 'Viewer', value: 'VIEWER' },
  ]
  return (
    <div className="container">
      {workspace.length
        ? <List
          loading={!workspace.length ? true : undefined}
          itemLayout="horizontal"
          size="large"
          pagination={workspace.length > 5 && {
            onChange: (page, pageSize) => {
              setPageConfig({ page, pageSize })
            },
            pageSize: pageConfig.pageSize,
            defaultPageSize: defaultPageSize,
            showQuickJumper: true,
            current: pageConfig.page
          }}
          split
          bordered
          dataSource={workspace}
          header={<div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Typography.Title level={5}>Welcome Back {loggedUserInfo?.firstName},</Typography.Title>
              <Button
                type="primary"
                disabled={loggedUserInfo.role === "invitee"}
                onClick={() => onImpersonateLogin()}>
                My account
              </Button>
            </div>
          </div>
          }
          renderItem={each => (
            <>
              <Divider orientation="right" plain style={{ margin: '16px 0 0 0' }}>workspace as {accessTypes.find(ea => ea.value === each.role?.as)['name']}</Divider>
              <List.Item
                key={each._id}
                actions={[
                  <Button
                    type="primary"
                    onClick={() => { onImpersonateLogin(each) }}>
                    {each.status ? "Go" : "Activate"}
                  </Button>
                ]}>
                <Skeleton avatar title='false' loading={!workspace.length}>
                  <List.Item.Meta
                    avatar={<Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf' }} src={each.owner?.avatar} >
                      {each.owner?.firstName?.[0]}
                    </Avatar>}
                    title={`${each.owner?.firstName} ${each.owner?.lastName}`}
                    description={each.role?.name}
                  />
                </Skeleton>
              </List.Item>
            </>
          )}
        // footer={<Select
        //   mode="multiple"
        //   style={{ minWidth: '15rem' }}
        //   placeholder="filter by role"
        //   defaultValue={_map(accessTypes, 'value')}
        //   onChange={(asd) => { console.log(asd) }}
        //   optionLabelProp="label">
        //   {accessTypes.map(
        //     each => <Select.Option key={each.name} value={each.value} label={each.name}>
        //       <div className="demo-option-label-item">
        //         <span role="img" aria-label={each.name}>
        //         </span>
        //         {each.name}
        //       </div>
        //     </Select.Option>)}
        // </Select>}
        /> : <React.Fragment />}
    </div>
  )
}
export default Workspace;