<script setup>
import {
  blankEvent,
  useCalendar,
} from '@/views/apps/calendar/useCalendar'
import { useCalendarStore } from '@/views/apps/calendar/useCalendarStore'
import FullCalendar from '@fullcalendar/vue3'

// Components
import CalendarEventHandler from '@/views/apps/calendar/CalendarEventHandler.vue'

// 👉 Store
const store = useCalendarStore()

// 👉 Event
const event = ref(structuredClone(blankEvent))
const isEventHandlerSidebarActive = ref(false)

watch(isEventHandlerSidebarActive, val => {
  if (!val)
    event.value = structuredClone(blankEvent)
})

const { isLeftSidebarOpen } = useResponsiveLeftSidebar()

// 👉 useCalendar
const { refCalendar, calendarOptions, addEvent, updateEvent, removeEvent, jumpToDate } = useCalendar(event, isEventHandlerSidebarActive, isLeftSidebarOpen)

// SECTION Sidebar

const jumpToDateFn = date => {
  jumpToDate(date)
}
</script>

<template>
  <div>
    <VCard>
      <!-- `z-index: 0` Allows overlapping vertical nav on calendar -->
      <VLayout style="z-index: 0;">
        <!-- 👉 Navigation drawer -->
        <VNavigationDrawer v-model="isLeftSidebarOpen" data-allow-mismatch width="292" absolute touchless
          location="start" class="calendar-add-event-drawer" :temporary="$vuetify.display.mdAndDown">
          <div style="margin: 1.5rem;">
            <VBtn block prepend-icon="tabler-plus" @click="isEventHandlerSidebarActive = true">
              Add event
            </VBtn>
          </div>

          <VDivider />

          <div class="d-flex align-center justify-center pa-2">
            <AppDateTimePicker id="calendar-date-picker" :model-value="new Date().toJSON().slice(0, 10)"
              :config="{ inline: true }" class="calendar-date-picker" @update:model-value="jumpToDateFn" />
          </div>

          <VDivider />
        </VNavigationDrawer>

        <VMain>
          <VCard flat>
            <FullCalendar ref="refCalendar" :options="calendarOptions" />
          </VCard>
        </VMain>
      </VLayout>
    </VCard>
    <CalendarEventHandler v-model:is-drawer-open="isEventHandlerSidebarActive" :event="event" @add-event="addEvent"
      @update-event="updateEvent" @remove-event="removeEvent" />
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/libs/full-calendar";

.calendar-add-event-drawer {
  &.v-navigation-drawer:not(.v-navigation-drawer--temporary) {
    border-end-start-radius: 0.375rem;
    border-start-start-radius: 0.375rem;
  }

  &.v-navigation-drawer--temporary:not(.v-navigation-drawer--active) {
    transform: translateX(-110%) !important;
  }
}

.calendar-date-picker {
  display: none;

  +.flatpickr-input {
    +.flatpickr-calendar.inline {
      border: none;
      box-shadow: none;

      .flatpickr-months {
        border-block-end: none;
      }
    }
  }

  &~.flatpickr-calendar .flatpickr-weekdays {
    margin-block: 0 4px;
  }
}

@media screen and (max-width: 1279px) {
  .calendar-add-event-drawer {
    border-width: 0;
  }
}
</style>
