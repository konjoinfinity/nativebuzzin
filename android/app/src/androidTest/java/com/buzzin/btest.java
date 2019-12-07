package com.buzzin;


import android.view.View;
import android.view.ViewGroup;
import android.view.ViewParent;

import androidx.test.espresso.ViewInteraction;
import androidx.test.filters.LargeTest;
import androidx.test.rule.ActivityTestRule;
import androidx.test.runner.AndroidJUnit4;

import org.hamcrest.Description;
import org.hamcrest.Matcher;
import org.hamcrest.TypeSafeMatcher;
import org.hamcrest.core.IsInstanceOf;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.action.ViewActions.*;
import static androidx.test.espresso.assertion.ViewAssertions.*;
import static androidx.test.espresso.matcher.ViewMatchers.*;
import static org.hamcrest.Matchers.allOf;
import static org.hamcrest.Matchers.is;

@LargeTest
@RunWith(AndroidJUnit4.class)
public class SplashActivityTest2 {

    @Rule
    public ActivityTestRule<SplashActivity> mActivityTestRule = new ActivityTestRule<>(SplashActivity.class);

    @Test
    public void splashActivityTest2() {
        ViewInteraction reactEditText = onView(
                allOf(childAtPosition(
                        childAtPosition(
                                withClassName(is("com.facebook.react.views.view.ReactViewGroup")),
                                0),
                        1),
                        isDisplayed()));
        reactEditText.perform(replaceText("test"), closeSoftKeyboard());

        ViewInteraction reactEditText2 = onView(
                allOf(withText("test"),
                        childAtPosition(
                                childAtPosition(
                                        withClassName(is("com.facebook.react.views.view.ReactViewGroup")),
                                        0),
                                1),
                        isDisplayed()));
        reactEditText2.perform(pressImeActionButton());

        ViewInteraction textView = onView(
                allOf(withText("Choose Gender ♂♀"),
                        childAtPosition(
                                childAtPosition(
                                        IsInstanceOf.<View>instanceOf(android.view.ViewGroup.class),
                                        2),
                                0),
                        isDisplayed()));
        textView.perform(press(matches(withText("Choose Gender ♂♀"))));
    }

    private static Matcher<View> childAtPosition(
            final Matcher<View> parentMatcher, final int position) {

        return new TypeSafeMatcher<View>() {
            @Override
            public void describeTo(Description description) {
                description.appendText("Child at position " + position + " in parent ");
                parentMatcher.describeTo(description);
            }

            @Override
            public boolean matchesSafely(View view) {
                ViewParent parent = view.getParent();
                return parent instanceof ViewGroup && parentMatcher.matches(parent)
                        && view.equals(((ViewGroup) parent).getChildAt(position));
            }
        };
    }
}
