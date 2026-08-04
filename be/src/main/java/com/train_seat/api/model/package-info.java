/**
 * Soft-delete applies to every entity in this package: deletes set {@code deleted_at}
 * and queries exclude rows where it is non-null.
 */
@SoftDelete(columnName = "deleted_at", strategy = SoftDeleteType.TIMESTAMP)
package com.train_seat.api.model;

import org.hibernate.annotations.SoftDelete;
import org.hibernate.annotations.SoftDeleteType;
