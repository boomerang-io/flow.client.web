import React from "react";
import PropTypes from "prop-types";
import { TextArea, TextInput } from "@boomerang/carbon-addons-boomerang-react";
import styles from "./taskTemplateViewOverview.module.scss";

TaskTemplateOverview.propTypes = {
  errors: PropTypes.object.isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  isEdit: PropTypes.bool.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  touched: PropTypes.object.isRequired,
  values: PropTypes.object.isRequired
};

export default function TaskTemplateOverview({
  errors,
  executorOptions,
  handleBlur,
  handleChange,
  isEdit,
  setFieldValue,
  touched,
  values
}) {
  return (
    <div className={styles.container}>
      <section className={styles.fieldsContainer}>
        <TextInput
          id="key"
          labelText="Key"
          placeholder="Key"
          name="key"
          disabled={isEdit}
          value={values.key}
          onBlur={handleBlur}
          onChange={handleChange}
          invalid={errors.key && touched.key}
          invalidText={errors.key}
        />
        <TextInput
          id="name"
          labelText="Name"
          placeholder="Name"
          name="name"
          value={values.name}
          onBlur={handleBlur}
          onChange={handleChange}
          invalid={errors.name && touched.name}
          invalidText={errors.name}
        />
        <TextInput
          id="category"
          labelText="Category"
          placeholder="Category"
          name="category"
          value={values.category}
          onBlur={handleBlur}
          onChange={handleChange}
          invalid={errors.category && touched.category}
          invalidText={errors.category}
        />
        <TextInput
          id="arguments"
          labelText="Arguments"
          helperText="Type the argument with spaces - e.g., slack message mail"
          placeholder="Arguments"
          name="arguments"
          value={values.arguments}
          onBlur={handleBlur}
          onChange={handleChange}
          invalid={errors.arguments && touched.arguments}
          invalidText={errors.arguments}
        />
        <TextInput
          id="command"
          labelText="Coomand"
          helperText="Helper text for command"
          placeholder="Command"
          name="command"
          value={values.command}
          onBlur={handleBlur}
          onChange={handleChange}
          invalid={errors.command && touched.command}
          invalidText={errors.command}
        />
        <TextInput
          id="image"
          labelText="Image"
          helperText="Helper text for image"
          placeholder="Image"
          name="image"
          value={values.image}
          onBlur={handleBlur}
          onChange={handleChange}
          invalid={errors.image && touched.image}
          invalidText={errors.image}
        />
        <TextArea
          id="description"
          labelText="Description"
          placeholder="Description"
          name="description"
          value={values.description}
          onBlur={handleBlur}
          onChange={handleChange}
          invalid={errors.description && touched.description}
          invalidText={errors.description}
        />
      </section>
    </div>
  );
}
