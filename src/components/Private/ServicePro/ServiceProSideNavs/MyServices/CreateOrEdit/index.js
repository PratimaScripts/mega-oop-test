import { Button, Col, Divider, Modal, Row, Spin } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { useLazyQuery, useMutation, useQuery } from "react-apollo";
import { useParams, useHistory } from "react-router-dom";
import { message, Typography, Switch } from "antd";

import "./style.scss";

import AdminQueries from "../../../../../../config/queries/admin";
import DropDown from "./DropDown";
import InputField from "./InputField";
import EditableTagGroup from "./Tags";
import Variant from "./Variant";
import { isEmpty } from "lodash-es";
import {
  createNewService,
  fetchSingleService,
  updateService,
} from "../../../../../../config/queries/service";
import UserRoleQueries from "../../../../../../config/queries/userRole";
import ImageSection from "./ImageSection";
import { UserDataContext } from "store/contexts/UserContext";
import showNotification from "config/Notification";

const checkIsNumber = (value) => {
  if (isNaN(Number(value))) {
    message.error("This field must be a number!");
    return false;
  } else return true;
};

const variantsState = [
  {
    title: "Basic",
    description: "",
    price: 0,
  },
  {
    title: "Standard",
    description: "",
    price: 0,
  },
  {
    title: "Premium",
    description: "",
    price: 0,
  },
];

const CreateOrEditService = () => {
  const params = useParams();
  const history = useHistory();
  const { state } = useContext(UserDataContext);
  const { data, called } = useQuery(AdminQueries.getTaskCategories);

  const [executeFetchServiceQuery, { loading: fetchLoading }] = useLazyQuery(
    fetchSingleService,
    {
      onCompleted: (data) => {
        // set New State
        if (!data?.getServiceById) {
          message.error("Service not found!");
          return history.replace("/servicepro/myservices");
        }
        const service = data.getServiceById;
        // console.log(service);

        setMongoId(service._id);
        setHasVariant(service.hasVariants);
        setTags(service.tags);
        setTitle(service.title);
        setDescription(service.description);
        setPrice(service.price);
        setImages(service.images);
        setVariants(service.variants);
        setStatus(service.status);

        // it will set sub-categories by category
        handleCategoryChange(service.category);
        setSelectedSubCategory(service.subCategory);
      },
    }
  );

  const [executeCreateServiceMutation, { loading: createLoading, error }] =
    useMutation(createNewService, {
      onError: () => {
        // console.log("object")
        // console.log(error.graphQLErrors);
        // console.log(error.message);
      },
      onCompleted: (data) => {
        if (data) {
          message.success("Service created successfully!");
          return history.replace("/servicepro/myservices");
        }
      },
    });

  const [
    executeEditServiceMutation,
    { loading: editLoading, error: editError },
  ] = useMutation(updateService, {
    onCompleted: (data) => {
      if (data) {
        showNotification("success", "Service updated successfully!");
        return history.replace("/servicepro/myservices");
      }
    },
  });

  useEffect(() => {
    editError &&
      editError.graphQLErrors.map((error) =>
        showNotification("error", error.message)
      );
  }, [editError]);

  useEffect(() => {
    error &&
      error.graphQLErrors.map((error) =>
        showNotification("error", error.message)
      );
  }, [error]);

  const categories = data?.getTaskCategories?.data;

  //, setLoading
  const [loading] = useState(false);

  const [isOnEditMode, setIsOnEditMode] = useState(false);
  const [mongoId, setMongoId] = useState(null);

  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");

  const [hasVariant, setHasVariant] = useState(false);
  const [tags, setTags] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState("Draft");
  const [variants, setVariants] = useState([]);

  const [hasPaymentMethod, setHasPaymentMethod] = useState(false);

  const { loading: fetchingPaymentDetails } = useQuery(
    UserRoleQueries.getUserPaymentType,
    {
      onCompleted: (data) => {
        if (data.getUserPaymentType.paymentType === "bank") {
          setHasPaymentMethod(
            data.getUserPaymentType.transferwise.accountId ? true : false
          );
        }
        if (data.getUserPaymentType.paymentType === "stripe") {
          setHasPaymentMethod(
            data.getUserPaymentType.stripeConnectAccId ? true : false
          );
        }
      },
      onError: (error) => {
        showNotification("error", "An error occurred!");
      },
    }
  );

  useEffect(() => {
    if (params.id !== "new") {
      setIsOnEditMode(true);
      executeFetchServiceQuery({
        variables: {
          serviceId: params.id,
        },
      });
    }
    return () => {
      // clean up
      setSubCategories([]);
      setSelectedCategory("");
      setSelectedSubCategory("");
      setHasVariant(false);
      setTags([]);
      setTitle("");
      setDescription("");
      setPrice("");
      setImages([]);
      setVariants(variantsState);
      setStatus("Draft");
      setIsOnEditMode(false);
      setMongoId(null);
      setHasPaymentMethod(false);
    };
  }, [params.id, executeFetchServiceQuery]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    const index = categories.findIndex((cat) => cat.name === category);
    if (index !== -1) {
      setSubCategories(categories[index].subCategory);
    } else {
      setSubCategories([]);
    }
  };

  const handleSubcategoryChange = (subCategory) => {
    setSelectedSubCategory(subCategory);
  };

  const handleOnVariantPriceChange = (index, price) => {
    if (checkIsNumber(price)) {
      const _variants = [...variants];
      _variants[index].price = Number(price);
      setVariants(_variants);
    }
  };

  const handleOnVariantDescriptionChange = (index, description) => {
    // console.log(index, description, variants);
    const _variants = [...variants];
    _variants[index].description = description;
    // console.log(_variants[index])
    setVariants(_variants);
  };

  const handleSubmit = ({ status: _status = "Draft" }) => {
    if (isEmpty(selectedCategory))
      return message.error("Category is required!");
    if (isEmpty(selectedSubCategory))
      return message.error("Sub-Category is required!");
    if (isEmpty(title) || title.length < 15 || title.length > 50)
      return message.error("Title should be in between 15 to 50 characters!");
    if (
      isEmpty(description) ||
      description.length < 100 ||
      description.length > 300
    )
      return message.error(
        "Description should be in between 100 to 300 characters!"
      );
    if (tags.length === 0)
      message.warn("Your skill tag is empty, you can still add!");

    if (hasVariant) {
      for (let i = 0; i < variants.length; i++) {
        const variant = variants[i];
        if (
          isEmpty(variant.description) ||
          description.length < 100 ||
          description.length > 300
        )
          return message.error(
            `${variant.title} variant description should be in between 100 to 300 characters!`
          );
        if (variant.price === 0)
          return message.error(`${variant.title} variant price is required!`);
      }
    } else {
      // it works inversely for Number
      if (price === 0 || price === "")
        return message.error("Price is required!");
    }

    if (images.length === 0) {
      return message.error("Choose at least one image!");
    }

    if (images.length > 3) {
      return message.error("You cannot choose more than 3 images!");
    }

    const variables = {
      title,
      description,
      category: selectedCategory,
      subCategory: selectedSubCategory,
      price: Number(price),
      tags,
      images,
      status: _status ? _status : status,
      hasVariant,
      variants: hasVariant ? variants : [],
    };

    if (isOnEditMode && mongoId) {
      variables.serviceId = mongoId;
      executeEditServiceMutation({ variables });
    } else {
      executeCreateServiceMutation({ variables });
    }
  };

  const handleToggleVariant = () => {
    if (!hasVariant && !variants.length) setVariants(variantsState);
    else setVariants([]);
    setHasVariant(!hasVariant);
  };

  const graphqlLoading = editLoading || fetchLoading || createLoading;

  const variantData = hasVariant
    ? variants.length === 0
      ? variantsState
      : variants
    : [];

  if (loading) return <div>loading...</div>;

  return fetchingPaymentDetails ? (
    <div className="d-flex justify-content-center my-5">
      <Spin />
    </div>
  ) : !hasPaymentMethod ? (
    <div>
      <Typography.Title className={"text-center"}>
        Payment Method is not available!
      </Typography.Title>
      <Modal
        visible
        title="Payment Method is not available!"
        onCancel={() => history.goBack()}
        onOk={() =>
          history.push(`/${state.userData.role}/settings/payment-method`)
        }
        okText={"Setup payment method!"}
      >
        <Typography>
          Please, choose your payment method first for creating a new service.
        </Typography>
      </Modal>
    </div>
  ) : (
    <div className="mainContainer">
      <div className="inContainer">
        <Spin tip="Loading..." spinning={graphqlLoading}>
          <Row aria-disabled={loading} gutter={[16, 16]}>
            <Col span={12}>
              <Typography.Text className="title">Category *</Typography.Text>
              {called && categories && (
                <DropDown
                  data={categories}
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  title="Category"
                />
              )}
            </Col>
            <Col span={12}>
              <Typography.Text className="title">Subcategory *</Typography.Text>
              <DropDown
                data={subCategories}
                value={selectedSubCategory}
                onChange={handleSubcategoryChange}
                fetchFromString
                title="Sub-Category"
              />
            </Col>

            <Col span={24}>
              <InputField
                title="Title *"
                name="title"
                placeholder="Title"
                value={title}
                onChange={setTitle}
              />
            </Col>
            <Col span={24}>
              <InputField
                title="Description *"
                className="description inputField"
                name="description"
                placeholder="Description"
                textArea
                value={description}
                onChange={setDescription}
              />
            </Col>
            <Col span={24} className="tags__container">
              <Typography.Text className="title">
                Tag service or skill *
              </Typography.Text>
              <div>
                <EditableTagGroup tags={tags} onTagChange={setTags} />
              </div>
            </Col>
            {!hasVariant && (
              <Col span={12}>
                <InputField
                  title="Price"
                  name="price"
                  placeholder="Price"
                  prefix={<i className="fas fa-pound-sign"></i>}
                  value={price}
                  onChange={(price) => {
                    if (checkIsNumber(price)) {
                      setPrice(price);
                    }
                  }}
                />
              </Col>
            )}

            <Col span={12}>
              <Typography.Text className="title">Variant Price</Typography.Text>
              <Switch
                className="variant-switch"
                onChange={handleToggleVariant}
                checked={hasVariant}
              />
            </Col>
          </Row>

          <Row>
            <Col span={24}>
              <ImageSection images={images} setImages={setImages} />
            </Col>
          </Row>

          {hasVariant && (
            <>
              <Row>
                <Col span="24">
                  <Divider type="horizontal" />
                  <h5>Service Variants</h5>
                </Col>
              </Row>
              <Row gutter={[16, 16]} className="variant__container">
                {variantData.map((variant, index) => (
                  <Variant
                    description={variant.description}
                    title={variant.title}
                    price={variant.price}
                    onDescriptionChange={(description) =>
                      handleOnVariantDescriptionChange(index, description)
                    }
                    onPriceChange={(price) =>
                      handleOnVariantPriceChange(index, price)
                    }
                    variantType={variant.title}
                    key={index}
                  />
                ))}
              </Row>
            </>
          )}

          <Row aria-disabled={loading}>
            <div className="bottom-btn-group">
              <Button
                disabled={loading}
                onClick={() => {
                  if (!isOnEditMode && !mongoId) {
                    setStatus("Draft");
                  }
                  handleSubmit({ status: "Draft" });
                }}
                className="btn btn-primary"
              >
                Save
              </Button>
              <Button
                disabled={loading}
                onClick={async () => {
                  setStatus("Published");
                  handleSubmit({ status: "Published" });
                }}
                className="btn btn-publish"
              >
                Publish
              </Button>
            </div>
          </Row>
        </Spin>
      </div>
    </div>
  );
};

export default CreateOrEditService;
