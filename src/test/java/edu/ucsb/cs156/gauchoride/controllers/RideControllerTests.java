package edu.ucsb.cs156.gauchoride.controllers;

import edu.ucsb.cs156.gauchoride.repositories.UserRepository;
import edu.ucsb.cs156.gauchoride.testconfig.TestConfig;
import edu.ucsb.cs156.gauchoride.ControllerTestCase;
import edu.ucsb.cs156.gauchoride.entities.Ride;
import edu.ucsb.cs156.gauchoride.repositories.RideRepository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyDouble;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@WebMvcTest(controllers = RideController.class)
@Import(TestConfig.class)
public class RideControllerTests extends ControllerTestCase {

        @MockBean
        RideRepository rideRepository;

        @MockBean
        UserRepository userRepository;

        // Authorization tests for /api/ride_request/all

        @Test
        public void logged_out_users_cannot_get_all() throws Exception {
                mockMvc.perform(get("/api/ride_request/all"))
                                .andExpect(status().is(403)); // logged out users can't get all
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_users_can_get_all_of_theirs() throws Exception {
                mockMvc.perform(get("/api/ride_request/all"))
                                .andExpect(status().is(200)); // logged
        }

        @WithMockUser(roles = { "DRIVER" })
        @Test
        public void logged_in_driver_can_get_all() throws Exception {
                mockMvc.perform(get("/api/ride_request/all"))
                                .andExpect(status().is(200)); // logged
        }

        @WithMockUser(roles = { "ADMIN" })
        @Test
        public void logged_in_admin_can_get_all() throws Exception {
                mockMvc.perform(get("/api/ride_request/all"))
                                .andExpect(status().is(200)); // logged
        }

        // Authorization tests for /api/ride_request?id={}

        @Test
        public void logged_out_users_cannot_get_by_id() throws Exception {
                mockMvc.perform(get("/api/ride_request?id=7"))
                                .andExpect(status().is(403)); // logged out users can't get by id
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_users_can_get_by_id_that_is_theirs() throws Exception {
                mockMvc.perform(get("/api/ride_request?id=7"))
                                .andExpect(status().is(404)); // logged, but no id exists
        }

        @WithMockUser(roles = { "DRIVER" })
        @Test
        public void logged_in_driver_can_get_by_id() throws Exception {
                mockMvc.perform(get("/api/ride_request?id=7"))
                                .andExpect(status().is(404)); // logged, but no id exists
        }

        @WithMockUser(roles = { "ADMIN" })
        @Test
        public void logged_in_admin_can_get_by_id() throws Exception {
                mockMvc.perform(get("/api/ride_request?id=7"))
                                .andExpect(status().is(404)); // logged, but no id exists
        }

        // Authorization tests for /api/ride_request/post

        @Test
        public void logged_out_users_cannot_post() throws Exception {
                mockMvc.perform(post("/api/ride_request/post"))
                                .andExpect(status().is(403));
        }

        @WithMockUser(roles = { "DRIVER" })
        @Test
        public void logged_in_driver_cannot_post() throws Exception {
                mockMvc.perform(post("/api/ride_request/post"))
                                .andExpect(status().is(403));
        }

        // Authorization tests for delete /api/ride_request

        @Test
         public void logged_out_users_cannot_delete() throws Exception {
                 mockMvc.perform(delete("/api/ride_request?id=9"))
                                 .andExpect(status().is(403));
        }


        // Authorization tests for put /api/ride_request

        @Test
         public void logged_out_users_cannot_edit() throws Exception {
                 mockMvc.perform(put("/api/ride_request?id=9"))
                                 .andExpect(status().is(403));
        }

        // // Tests with mocks for database actions



        // GET BY ID


        @WithMockUser(roles = { "USER" })
        @Test
        public void test_that_logged_in_user_can_get_by_id_when_the_id_exists_and_user_id_matches() throws Exception {

                // arrange

                long userId = currentUserService.getCurrentUser().getUser().getId();

                Ride ride = Ride.builder()
                                .riderId(userId)
                                .student("CGaucho")
                                .day("Monday")
                                .course("CMPSC 156")
                                .startTime("2:00PM")
                                .endTime("3:15PM")
                                .dropoffBuilding("South Hall")
                                .pickupBuilding("Phelps Hall")
                                .dropoffRoom("1431")
                                .build();

                when(rideRepository.findByIdAndRiderId(eq(7L), eq(userId))).thenReturn(Optional.of(ride));

                // act
                MvcResult response = mockMvc.perform(get("/api/ride_request?id=7"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(rideRepository, times(1)).findByIdAndRiderId(eq(7L), eq(userId));
                String expectedJson = mapper.writeValueAsString(ride);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void test_that_logged_in_user_can_get_by_id_when_the_id_does_not_exist() throws Exception {

                // arrange

                long userId = currentUserService.getCurrentUser().getUser().getId();

                when(rideRepository.findByIdAndRiderId(eq(7L), eq(userId))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(get("/api/ride_request?id=7"))
                                .andExpect(status().isNotFound()).andReturn();

                // assert

                verify(rideRepository, times(1)).findByIdAndRiderId(eq(7L), eq(userId));
                Map<String, Object> json = responseToJson(response);
                assertEquals("EntityNotFoundException", json.get("type"));
                assertEquals("Ride with id 7 not found", json.get("message"));
        }
        

        @WithMockUser(roles = { "USER" })
        @Test
        public void test_that_logged_in_user_can_get_by_id_when_the_id_exists_and_user_id_does_not_match() throws Exception {

                // arrange

                long userId = currentUserService.getCurrentUser().getUser().getId();
                long otherUserId = userId + 1;

                Ride ride = Ride.builder()
                                .riderId(otherUserId)
                                .student("CGaucho")
                                .day("Monday")
                                .course("CMPSC 156")
                                .startTime("2:00PM")
                                .endTime("3:15PM")
                                .dropoffBuilding("South Hall")
                                .pickupBuilding("Phelps Hall")
                                .dropoffRoom("1431")
                                .build();

                when(rideRepository.findByIdAndRiderId(eq(7L), eq(otherUserId))).thenReturn(Optional.of(ride));

                // act
                MvcResult response = mockMvc.perform(get("/api/ride_request?id=7"))
                                .andExpect(status().isNotFound()).andReturn();

                // assert

                verify(rideRepository, times(1)).findByIdAndRiderId(eq(7L), eq(userId));
                Map<String, Object> json = responseToJson(response);
                assertEquals("EntityNotFoundException", json.get("type"));
                assertEquals("Ride with id 7 not found", json.get("message"));
        }



        @WithMockUser(roles = { "ADMIN" , "USER" })
        @Test
        public void test_that_logged_in_admin_can_get_by_id_when_the_id_exists() throws Exception {

                // arrange

                long userId = currentUserService.getCurrentUser().getUser().getId();
                long otherUserId = userId + 1;

                Ride ride = Ride.builder()
                                .riderId(otherUserId)
                                .student("CGaucho")
                                .day("Monday")
                                .course("CMPSC 156")
                                .startTime("2:00PM")
                                .endTime("3:15PM")
                                .dropoffBuilding("South Hall")
                                .pickupBuilding("Phelps Hall")
                                .dropoffRoom("1431")
                                .build();

                when(rideRepository.findById(eq(7L))).thenReturn(Optional.of(ride));

                // act
                MvcResult response = mockMvc.perform(get("/api/ride_request?id=7"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(rideRepository, times(1)).findById(eq(7L));
                String expectedJson = mapper.writeValueAsString(ride);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "DRIVER" })
        @Test
        public void test_that_logged_in_driver_can_get_by_id_when_the_id_exists() throws Exception {

                // arrange

                long userId = currentUserService.getCurrentUser().getUser().getId();
                long otherUserId = userId + 1;

                Ride ride = Ride.builder()
                                .riderId(otherUserId)
                                .student("DGaucho")
                                .day("Monday")
                                .course("CMPSC 156")
                                .startTime("2:00PM")
                                .endTime("3:15PM")
                                .dropoffBuilding("South Hall")
                                .pickupBuilding("Phelps Hall")
                                .dropoffRoom("1431")
                                .build();

                when(rideRepository.findById(eq(7L))).thenReturn(Optional.of(ride));

                // act
                MvcResult response = mockMvc.perform(get("/api/ride_request?id=7"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(rideRepository, times(1)).findById(eq(7L));
                String expectedJson = mapper.writeValueAsString(ride);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "ADMIN" , "USER" })
        @Test
        public void test_that_logged_in_admin_can_get_by_id_when_the_id_does_not_exist() throws Exception {

                // arrange

                when(rideRepository.findById(eq(7L))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(get("/api/ride_request?id=7"))
                                .andExpect(status().isNotFound()).andReturn();

                // assert

                verify(rideRepository, times(1)).findById(eq(7L));
                Map<String, Object> json = responseToJson(response);
                assertEquals("EntityNotFoundException", json.get("type"));
                assertEquals("Ride with id 7 not found", json.get("message"));
        }

        @WithMockUser(roles = { "DRIVER" })
        @Test
        public void test_that_logged_in_driver_can_get_by_id_when_the_id_does_not_exist() throws Exception {

                // arrange

                when(rideRepository.findById(eq(7L))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(get("/api/ride_request?id=7"))
                                .andExpect(status().isNotFound()).andReturn();

                // assert

                verify(rideRepository, times(1)).findById(eq(7L));
                Map<String, Object> json = responseToJson(response);
                assertEquals("EntityNotFoundException", json.get("type"));
                assertEquals("Ride with id 7 not found", json.get("message"));
        }
        


        // GET ALL

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_user_can_get_all_their_own_rides() throws Exception {

                long userId = currentUserService.getCurrentUser().getUser().getId();

                Ride ride1 = Ride.builder()
                                .riderId(userId)
                                .student("CGaucho")
                                .day("Monday")
                                .course("CMPSC 156")
                                .startTime("2:00PM")
                                .endTime("3:15PM")
                                .dropoffBuilding("South Hall")
                                .pickupBuilding("Phelps Hall")
                                .dropoffRoom("1431")
                                .build();

                Ride ride3 = Ride.builder()
                                .riderId(userId)
                                .student("CGaucho")
                                .day("Thursday")
                                .course("MATH 111C")
                                .startTime("9:30AM")
                                .endTime("10:45AM")
                                .dropoffBuilding("Phelps Hall")
                                .pickupBuilding("Student Resource Building")
                                .dropoffRoom("3505")
                                .build();

                ArrayList<Ride> expectedRides = new ArrayList<>();
                expectedRides.addAll(Arrays.asList(ride1, ride3));

                when(rideRepository.findAllByRiderId(eq(userId))).thenReturn(expectedRides);

                // act
                MvcResult response = mockMvc.perform(get("/api/ride_request/all"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(rideRepository, times(1)).findAllByRiderId(eq(userId));
                String expectedJson = mapper.writeValueAsString(expectedRides);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "ADMIN" , "USER" })
        @Test
        public void logged_in_admin_can_get_all_rides() throws Exception {

                long userId = currentUserService.getCurrentUser().getUser().getId();
                long otherUserId = userId + 1;

                Ride ride1 = Ride.builder()
                                .riderId(userId)
                                .student("CGaucho")
                                .day("Monday")
                                .course("CMPSC 156")
                                .startTime("2:00PM")
                                .endTime("3:15PM")
                                .dropoffBuilding("South Hall")
                                .pickupBuilding("Phelps Hall")
                                .dropoffRoom("1431")
                                .build();

                Ride ride2 = Ride.builder()
                                .riderId(otherUserId)
                                .student("DGaucho")
                                .day("Thursday")
                                .course("MATH 118C")
                                .startTime("12:30PM")
                                .endTime("1:45PM")
                                .dropoffBuilding("Phelps Hall")
                                .pickupBuilding("UCen")
                                .dropoffRoom("3505")
                                .build();

                Ride ride3 = Ride.builder()
                                .riderId(userId)
                                .student("CGaucho")
                                .day("Thursday")
                                .course("MATH 111C")
                                .startTime("9:30AM")
                                .endTime("10:45AM")
                                .dropoffBuilding("Phelps Hall")
                                .pickupBuilding("Student Resource Building")
                                .dropoffRoom("3505")
                                .build();

                ArrayList<Ride> expectedRides = new ArrayList<>();
                expectedRides.addAll(Arrays.asList(ride1, ride2, ride3));

                when(rideRepository.findAll()).thenReturn(expectedRides);

                // act
                MvcResult response = mockMvc.perform(get("/api/ride_request/all"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(rideRepository, times(1)).findAll();
                String expectedJson = mapper.writeValueAsString(expectedRides);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "DRIVER" })
        @Test
        public void logged_in_driver_can_get_all_rides() throws Exception {

                long userId = currentUserService.getCurrentUser().getUser().getId();
                long otherUserId = userId + 1;

                Ride ride1 = Ride.builder()
                                .riderId(userId)
                                .student("CGaucho")
                                .day("Monday")
                                .course("CMPSC 156")
                                .startTime("2:00PM")
                                .endTime("3:15PM")
                                .dropoffBuilding("South Hall")
                                .pickupBuilding("Phelps Hall")
                                .dropoffRoom("1431")
                                .build();

                Ride ride2 = Ride.builder()
                                .riderId(otherUserId)
                                .student("DGaucho")
                                .day("Thursday")
                                .course("MATH 118C")
                                .startTime("12:30PM")
                                .endTime("1:45PM")
                                .dropoffBuilding("Phelps Hall")
                                .pickupBuilding("UCen")
                                .dropoffRoom("3505")
                                .build();

                Ride ride3 = Ride.builder()
                                .riderId(userId)
                                .student("CGaucho")
                                .day("Thursday")
                                .course("MATH 111C")
                                .startTime("9:30AM")
                                .endTime("10:45AM")
                                .dropoffBuilding("Phelps Hall")
                                .pickupBuilding("Student Resource Building")
                                .dropoffRoom("3505")
                                .build();

                ArrayList<Ride> expectedRides = new ArrayList<>();
                expectedRides.addAll(Arrays.asList(ride1, ride2, ride3));

                when(rideRepository.findAll()).thenReturn(expectedRides);

                // act
                MvcResult response = mockMvc.perform(get("/api/ride_request/all"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(rideRepository, times(1)).findAll();
                String expectedJson = mapper.writeValueAsString(expectedRides);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }



        // POST



        @WithMockUser(roles = { "USER" })
        @Test
        public void a_user_can_post_a_new_ride() throws Exception {
                // arrange

                long userId = currentUserService.getCurrentUser().getUser().getId();

                Ride ride1 = Ride.builder()
                        .riderId(userId)
                        .student("Fake user")
                        .day("Monday")
                        .course("CMPSC 156")
                        .startTime("2:00PM")
                        .endTime("3:15PM")
                        .dropoffBuilding("South Hall")
                        .pickupBuilding("Phelps Hall")
                        .dropoffRoom("1431")
                        .pickupRoom("1432")
                        .notes("")
                        .build();

                when(rideRepository.save(eq(ride1))).thenReturn(ride1);

                String postRequesString = "day=Monday&course=CMPSC 156&startTime=2:00PM&endTime=3:15PM&pickupBuilding=Phelps Hall&pickupRoom=1432&dropoffBuilding=South Hall&dropoffRoom=1431&notes=";

                // act
                MvcResult response = mockMvc.perform(
                                post("/api/ride_request/post?" + postRequesString)
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(rideRepository, times(1)).save(ride1);
                String expectedJson = mapper.writeValueAsString(ride1);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }


        


        // DELETE

        @WithMockUser(roles = { "USER" })
        @Test
        public void user_can_delete_their_own_ride() throws Exception {
                // arrange

                long userId = currentUserService.getCurrentUser().getUser().getId();

                Ride ride1 = Ride.builder()
                        .riderId(userId)
                        .student("CGaucho")
                        .day("Monday")
                        .course("CMPSC 156")
                        .startTime("2:00PM")
                        .endTime("3:15PM")
                        .dropoffBuilding("South Hall")
                        .pickupBuilding("Phelps Hall")
                        .dropoffRoom("1431")
                        .pickupRoom("1432")
                        .notes("")
                        .build();

                when(rideRepository.findByIdAndRiderId(eq(15L), eq(userId))).thenReturn(Optional.of(ride1));

                // act
                MvcResult response = mockMvc.perform(
                                delete("/api/ride_request?id=15")
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assertuserId
                verify(rideRepository, times(1)).findByIdAndRiderId(eq(15L), eq(userId));
                verify(rideRepository, times(1)).delete(ride1);

                Map<String, Object> json = responseToJson(response);
                assertEquals("Ride with id 15 deleted", json.get("message"));
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void user_tries_to_delete_other_users_ride_and_fails()
                        throws Exception {
                // arrange

                long userId = currentUserService.getCurrentUser().getUser().getId();
                long otherUserId = userId + 1;

                Ride ride1 = Ride.builder()
                        .riderId(otherUserId)
                        .student("CGaucho")
                        .day("Monday")
                        .course("CMPSC 156")
                        .startTime("2:00PM")
                        .endTime("3:15PM")
                        .dropoffBuilding("South Hall")
                        .pickupBuilding("Phelps Hall")
                        .dropoffRoom("1431")
                        .pickupRoom("1432")
                        .notes("")
                        .build();

                when(rideRepository.findByIdAndRiderId(eq(15L), eq(otherUserId))).thenReturn(Optional.of(ride1));

                // act
                MvcResult response = mockMvc.perform(
                                delete("/api/ride_request?id=15")
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert
                verify(rideRepository, times(1)).findByIdAndRiderId(eq(15L), eq(userId));
                Map<String, Object> json = responseToJson(response);
                assertEquals("Ride with id 15 not found", json.get("message"));
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void user_tries_to_delete_non_existant_ride_and_gets_right_error_message()
                        throws Exception {
                // arrange

                long userId = currentUserService.getCurrentUser().getUser().getId();

                when(rideRepository.findByIdAndRiderId(eq(15L), eq(userId))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(
                                delete("/api/ride_request?id=15")
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert
                verify(rideRepository, times(1)).findByIdAndRiderId(eq(15L), eq(userId));
                Map<String, Object> json = responseToJson(response);
                assertEquals("Ride with id 15 not found", json.get("message"));
        }


        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_can_delete_any_ride() throws Exception {
                // arrange

                long userId = currentUserService.getCurrentUser().getUser().getId();
                long otherUserId = userId + 1;

                Ride ride1 = Ride.builder()
                        .riderId(otherUserId)
                        .student("CGaucho")
                        .day("Monday")
                        .course("CMPSC 156")
                        .startTime("2:00PM")
                        .endTime("3:15PM")
                        .dropoffBuilding("South Hall")
                        .pickupBuilding("Phelps Hall")
                        .dropoffRoom("1431")
                        .pickupRoom("1432")
                        .notes("")
                        .build();

                when(rideRepository.findById(eq(15L))).thenReturn(Optional.of(ride1));

                // act
                MvcResult response = mockMvc.perform(
                                delete("/api/ride_request?id=15")
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(rideRepository, times(1)).findById(15L);
                verify(rideRepository, times(1)).delete(ride1);

                Map<String, Object> json = responseToJson(response);
                assertEquals("Ride with id 15 deleted", json.get("message"));
        }

        @WithMockUser(roles = { "DRIVER" })
        @Test
        public void driver_can_delete_any_ride() throws Exception {
                // arrange

                long userId = currentUserService.getCurrentUser().getUser().getId();
                long otherUserId = userId + 1;

                Ride ride1 = Ride.builder()
                        .riderId(otherUserId)
                        .student("DGaucho")
                        .day("Monday")
                        .course("CMPSC 156")
                        .startTime("2:00PM")
                        .endTime("3:15PM")
                        .dropoffBuilding("South Hall")
                        .pickupBuilding("Phelps Hall")
                        .dropoffRoom("1431")
                        .pickupRoom("1432")
                        .notes("")
                        .build();

                when(rideRepository.findById(eq(15L))).thenReturn(Optional.of(ride1));

                // act
                MvcResult response = mockMvc.perform(
                                delete("/api/ride_request?id=15")
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(rideRepository, times(1)).findById(15L);
                verify(rideRepository, times(1)).delete(ride1);

                Map<String, Object> json = responseToJson(response);
                assertEquals("Ride with id 15 deleted", json.get("message"));
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_tries_to_delete_non_existant_ride_and_gets_right_error_message()
                        throws Exception {
                // arrange

                when(rideRepository.findById(eq(15L))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(
                                delete("/api/ride_request?id=15")
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert
                verify(rideRepository, times(1)).findById(15L);
                Map<String, Object> json = responseToJson(response);
                assertEquals("Ride with id 15 not found", json.get("message"));
        }


        @WithMockUser(roles = { "DRIVER" })
        @Test
        public void driver_tries_to_delete_non_existant_ride_and_gets_right_error_message()
                        throws Exception {
                // arrange

                when(rideRepository.findById(eq(15L))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(
                                delete("/api/ride_request?id=15")
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert
                verify(rideRepository, times(1)).findById(15L);
                Map<String, Object> json = responseToJson(response);
                assertEquals("Ride with id 15 not found", json.get("message"));
        }




        // EDIT

        @WithMockUser(roles = { "USER" })
        @Test
        public void user_can_edit_their_own_ride() throws Exception {
                // arrange

                long userId = currentUserService.getCurrentUser().getUser().getId();

                Ride ride_original = Ride.builder()
                                .riderId(userId)
                                .student("CGaucho")
                                .day("Monday")
                                .course("CMPSC 156")
                                .startTime("2:00PM")
                                .endTime("3:15PM")
                                .dropoffBuilding("South Hall")
                                .pickupBuilding("Phelps Hall")
                                .dropoffRoom("1431")
                                .pickupRoom("1432")
                                .notes("")
                                .build();

                Ride ride_edited = Ride.builder()
                                .riderId(userId)
                                .student("CGaucho")
                                .day("Thursday")
                                .course("MATH 118C")
                                .startTime("12:30PM")
                                .endTime("1:45PM")
                                .dropoffBuilding("Phelps Hall")
                                .pickupBuilding("UCen")
                                .dropoffRoom("3505")
                                .pickupRoom("1111")
                                .notes("SomeNote")
                                .build();

                String requestBody = mapper.writeValueAsString(ride_edited);

                when(rideRepository.findByIdAndRiderId(eq(67L), eq(userId))).thenReturn(Optional.of(ride_original));

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/ride_request?id=67")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .characterEncoding("utf-8")
                                                .content(requestBody)
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(rideRepository, times(1)).findByIdAndRiderId(eq(67L), eq(userId));
                verify(rideRepository, times(1)).save(ride_edited); // should be saved with correct user
                String responseString = response.getResponse().getContentAsString();
                assertEquals(requestBody, responseString);
        }


        @WithMockUser(roles = { "USER" })
        @Test
        public void user_canot_edit_other_users_ride() throws Exception {
                // arrange

                long userId = currentUserService.getCurrentUser().getUser().getId();
                long otherUserId = userId + 1;

                Ride ride_original = Ride.builder()
                                .riderId(otherUserId)
                                .student("DGaucho")
                                .day("Monday")
                                .course("CMPSC 156")
                                .startTime("2:00PM")
                                .endTime("3:15PM")
                                .dropoffBuilding("South Hall")
                                .pickupBuilding("Phelps Hall")
                                .dropoffRoom("1431")
                                .pickupRoom("1432")
                                .notes("")
                                .build();

                Ride ride_edited = Ride.builder()
                                .riderId(otherUserId)
                                .student("DGaucho")
                                .day("Thursday")
                                .course("MATH 118C")
                                .startTime("12:30PM")
                                .endTime("1:45PM")
                                .dropoffBuilding("Phelps Hall")
                                .pickupBuilding("UCen")
                                .dropoffRoom("3505")
                                .pickupRoom("1111")
                                .notes("SomeNote")
                                .build();

                String requestBody = mapper.writeValueAsString(ride_edited);

                when(rideRepository.findByIdAndRiderId(eq(67L), eq(otherUserId))).thenReturn(Optional.of(ride_original));

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/ride_request?id=67")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .characterEncoding("utf-8")
                                                .content(requestBody)
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert
                verify(rideRepository, times(1)).findByIdAndRiderId(eq(67L), eq(userId));
                Map<String, Object> json = responseToJson(response);
                assertEquals("Ride with id 67 not found", json.get("message"));
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void user_cannot_edit_ride_that_does_not_exist() throws Exception {
                // arrange

                long userId = currentUserService.getCurrentUser().getUser().getId();

                Ride ride_edited = Ride.builder()
                                .riderId(userId)
                                .student("CGaucho")
                                .day("Thursday")
                                .course("MATH 118C")
                                .startTime("12:30PM")
                                .endTime("1:45PM")
                                .dropoffBuilding("Phelps Hall")
                                .pickupBuilding("UCen")
                                .dropoffRoom("3505")
                                .pickupRoom("1432")
                                .notes("")
                                .build();


                String requestBody = mapper.writeValueAsString(ride_edited);

                when(rideRepository.findByIdAndRiderId(eq(67L), eq(userId))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/ride_request?id=67")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .characterEncoding("utf-8")
                                                .content(requestBody)
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert
                verify(rideRepository, times(1)).findByIdAndRiderId(67L, userId);
                Map<String, Object> json = responseToJson(response);
                assertEquals("Ride with id 67 not found", json.get("message"));

        }


        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_can_edit_an_existing_ride() throws Exception {
                // arrange

                long userId = currentUserService.getCurrentUser().getUser().getId();
                long otherUserId = userId + 1;

                Ride ride_original = Ride.builder()
                                .riderId(otherUserId)
                                .student("DGaucho")
                                .day("Monday")
                                .course("CMPSC 156")
                                .startTime("2:00PM")
                                .endTime("3:15PM")
                                .dropoffBuilding("South Hall")
                                .pickupBuilding("Phelps Hall")
                                .dropoffRoom("1431")
                                .pickupRoom("1432")
                                .notes("")
                                .build();

                Ride ride_edited = Ride.builder()
                                .riderId(otherUserId)
                                .student("DGaucho")
                                .day("Thursday")
                                .course("MATH 118C")
                                .startTime("12:30PM")
                                .endTime("1:45PM")
                                .dropoffBuilding("Phelps Hall")
                                .pickupBuilding("UCen")
                                .dropoffRoom("3505")
                                .pickupRoom("1455")
                                .notes("Yay")
                                .build();

                String requestBody = mapper.writeValueAsString(ride_edited);

                when(rideRepository.findById(eq(67L))).thenReturn(Optional.of(ride_original));

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/ride_request?id=67")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .characterEncoding("utf-8")
                                                .content(requestBody)
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(rideRepository, times(1)).findById(67L);
                verify(rideRepository, times(1)).save(ride_edited); // should be saved with correct user
                String responseString = response.getResponse().getContentAsString();
                assertEquals(requestBody, responseString);
        }

        @WithMockUser(roles = { "DRIVER" })
        @Test
        public void driver_can_edit_an_existing_ride() throws Exception {
                // arrange

                long userId = currentUserService.getCurrentUser().getUser().getId();
                long otherUserId = userId + 1;

                Ride ride_original = Ride.builder()
                                .riderId(otherUserId)
                                .student("DGaucho")
                                .day("Monday")
                                .course("CMPSC 156")
                                .startTime("2:00PM")
                                .endTime("3:15PM")
                                .dropoffBuilding("South Hall")
                                .pickupBuilding("Phelps Hall")
                                .dropoffRoom("1431")
                                .pickupRoom("1432")
                                .notes("Real Room")
                                .build();

                Ride ride_edited = Ride.builder()
                                .riderId(otherUserId)
                                .student("DGaucho")
                                .day("Thursday")
                                .course("MATH 118C")
                                .startTime("12:30PM")
                                .endTime("1:45PM")
                                .dropoffBuilding("Phelps Hall")
                                .pickupBuilding("UCen")
                                .dropoffRoom("3505")
                                .pickupRoom("7524")
                                .notes("Not real Room")
                                .build();

                String requestBody = mapper.writeValueAsString(ride_edited);

                when(rideRepository.findById(eq(67L))).thenReturn(Optional.of(ride_original));

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/ride_request?id=67")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .characterEncoding("utf-8")
                                                .content(requestBody)
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(rideRepository, times(1)).findById(67L);
                verify(rideRepository, times(1)).save(ride_edited); // should be saved with correct user
                String responseString = response.getResponse().getContentAsString();
                assertEquals(requestBody, responseString);
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_cannot_edit_ride_that_does_not_exist() throws Exception {
                // arrange

                long userId = currentUserService.getCurrentUser().getUser().getId();

                Ride ride_edited = Ride.builder()
                                .riderId(userId)
                                .student("CGaucho")
                                .day("Thursday")
                                .course("MATH 118C")
                                .startTime("12:30PM")
                                .endTime("1:45PM")
                                .dropoffBuilding("Phelps Hall")
                                .pickupBuilding("UCen")
                                .dropoffRoom("3505")
                                .pickupRoom("1432")
                                .notes("Fake Ride")
                                .build();

                String requestBody = mapper.writeValueAsString(ride_edited);

                when(rideRepository.findById(eq(67L))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/ride_request?id=67")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .characterEncoding("utf-8")
                                                .content(requestBody)
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert
                verify(rideRepository, times(1)).findById(67L);
                Map<String, Object> json = responseToJson(response);
                assertEquals("Ride with id 67 not found", json.get("message"));
        }

        @WithMockUser(roles = { "DRIVER" })
        @Test
        public void driver_cannot_edit_ride_that_does_not_exist() throws Exception {
                // arrange

                long userId = currentUserService.getCurrentUser().getUser().getId();

                Ride ride_edited = Ride.builder()
                                .riderId(userId)
                                .student("CGaucho")
                                .day("Thursday")
                                .course("MATH 118C")
                                .startTime("12:30PM")
                                .endTime("1:45PM")
                                .dropoffBuilding("Phelps Hall")
                                .pickupBuilding("UCen")
                                .dropoffRoom("3505")
                                .pickupRoom("3505")
                                .notes("")
                                .build();

                String requestBody = mapper.writeValueAsString(ride_edited);

                when(rideRepository.findById(eq(67L))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/ride_request?id=67")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .characterEncoding("utf-8")
                                                .content(requestBody)
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert
                verify(rideRepository, times(1)).findById(67L);
                Map<String, Object> json = responseToJson(response);
                assertEquals("Ride with id 67 not found", json.get("message"));
        }

        @WithMockUser(roles = { "DRIVER" })
        @Test
        public void logged_in_driver_can_get_rides_by_shift_id() throws Exception {
                long shiftId = 1L;
                
                Ride ride1 = Ride.builder()
                                .riderId(1L)
                                .student("CGaucho")
                                .day("Monday")
                                .course("CMPSC 156")
                                .startTime("2:00PM")
                                .endTime("3:15PM")
                                .dropoffBuilding("South Hall")
                                .pickupBuilding("Phelps Hall")
                                .dropoffRoom("1431")
                                .shiftId(shiftId)
                                .build();
                
                Ride ride2 = Ride.builder()
                                .riderId(2L)
                                .student("DGaucho")
                                .day("Thursday")
                                .course("MATH 118C")
                                .startTime("12:30PM")
                                .endTime("1:45PM")
                                .dropoffBuilding("Phelps Hall")
                                .pickupBuilding("UCen")
                                .dropoffRoom("3505")
                                .shiftId(shiftId)
                                .build();
                
                ArrayList<Ride> expectedRides = new ArrayList<>(Arrays.asList(ride1, ride2));
                
                when(rideRepository.findAllByShiftId(eq(shiftId))).thenReturn(expectedRides);
                
                // act
                MvcResult response = mockMvc.perform(get("/api/ride_request/shiftId?shiftId=" + shiftId))
                                .andExpect(status().isOk())
                                .andReturn();
                
                // assert
                verify(rideRepository, times(1)).findAllByShiftId(eq(shiftId));
                String expectedJson = mapper.writeValueAsString(expectedRides);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "ADMIN" })
        @Test
        public void logged_in_admin_can_get_rides_by_shift_id() throws Exception {
                long shiftId = 1L;
                
                Ride ride1 = Ride.builder()
                                .riderId(1L)
                                .student("CGaucho")
                                .day("Monday")
                                .course("CMPSC 156")
                                .startTime("2:00PM")
                                .endTime("3:15PM")
                                .dropoffBuilding("South Hall")
                                .pickupBuilding("Phelps Hall")
                                .dropoffRoom("1431")
                                .shiftId(shiftId)
                                .build();
                
                Ride ride2 = Ride.builder()
                                .riderId(2L) // Assuming 'otherUserId'
                                .student("DGaucho")
                                .day("Thursday")
                                .course("MATH 118C")
                                .startTime("12:30PM")
                                .endTime("1:45PM")
                                .dropoffBuilding("Phelps Hall")
                                .pickupBuilding("UCen")
                                .dropoffRoom("3505")
                                .shiftId(shiftId)
                                .build();
                
                ArrayList<Ride> expectedRides = new ArrayList<>(Arrays.asList(ride1, ride2));
                
                when(rideRepository.findAllByShiftId(eq(shiftId))).thenReturn(expectedRides);
                
                // act
                MvcResult response = mockMvc.perform(get("/api/ride_request/shiftId?shiftId=" + shiftId))
                                .andExpect(status().isOk())
                                .andReturn();
                
                // assert
                verify(rideRepository, times(1)).findAllByShiftId(eq(shiftId));
                String expectedJson = mapper.writeValueAsString(expectedRides);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "ADMIN" })
        @Test
        public void admin_can_assign_shiftId_to_a_ride() throws Exception {
                // arange
                long shiftId = 1L;
                long rideId = 2L;
            
                Ride ride_original = Ride.builder()
                                .id(rideId) // Make sure to set the ID to match the ride being edited
                                .riderId(1L)
                                .student("DGaucho")
                                .day("Monday")
                                .course("CMPSC 156")
                                .startTime("2:00PM")
                                .endTime("3:15PM")
                                .dropoffBuilding("South Hall")
                                .pickupBuilding("Phelps Hall")
                                .dropoffRoom("1431")
                                .build();
            
                Ride ride_edited = Ride.builder()
                                .shiftId(shiftId)
                                .build();
            
                String requestBody = mapper.writeValueAsString(ride_edited);
            
                when(rideRepository.findById(eq(rideId))).thenReturn(Optional.of(ride_original));
            
                // act
                mockMvc.perform(put("/api/ride_request/assigndriver?id=" + rideId)
                                .contentType(MediaType.APPLICATION_JSON)
                                .characterEncoding("utf-8")
                                .content(requestBody)
                                .with(csrf()))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.status").value("Assigned"))
                        .andExpect(jsonPath("$.shiftId").value((int) shiftId));
                        
            
                // assert
                verify(rideRepository).findById(eq(rideId));
                verify(rideRepository).save(any(Ride.class));
        }

        @WithMockUser(roles = { "ADMIN" })
        @Test
        public void admin_cant_assigndriver_for_non_existent_ride_id() throws Exception {
                // arange
                long shiftId = 1L;
                long rideId = 2L;

                when(rideRepository.findById(eq(7L))).thenReturn(Optional.empty());

                Ride ride_edited = Ride.builder()
                                .shiftId(shiftId)
                                .build();
            
                String requestBody = mapper.writeValueAsString(ride_edited);

                // act
                MvcResult response = mockMvc.perform(put("/api/ride_request/assigndriver?id=" + rideId)
                                .contentType(MediaType.APPLICATION_JSON)
                                .characterEncoding("utf-8")
                                .content(requestBody)
                                .with(csrf()))
                        .andExpect(status().isNotFound()).andReturn();

                // assert

                verify(rideRepository, times(1)).findById(eq(rideId));
                Map<String, Object> json = responseToJson(response);
                assertEquals("EntityNotFoundException", json.get("type"));
                assertEquals("Ride with id " + rideId + " not found", json.get("message"));
        }


}